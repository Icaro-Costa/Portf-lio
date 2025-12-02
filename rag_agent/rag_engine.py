import os
import shutil
from langchain_community.document_loaders import TextLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.tools import Tool
from langchain.agents import create_tool_calling_agent, AgentExecutor
from dotenv import load_dotenv

# Import our custom tools
from github_tool import get_github_projects
from project_tool import get_random_projects, get_project_details

load_dotenv()

PERSIST_DIRECTORY = "./chroma_db"
DATA_DIRECTORY = "./data"

def load_and_index_data():
    """Carrega dados, divide e cria/atualiza o índice vetorial."""
    # Use local embeddings to avoid API quotas
    embedding_function = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    if os.path.exists(PERSIST_DIRECTORY):
        print(f"Índice encontrado em {PERSIST_DIRECTORY}. Carregando...")
        return Chroma(persist_directory=PERSIST_DIRECTORY, embedding_function=embedding_function)

    print("Criando novo índice...")
    
    # Load text files
    loader = DirectoryLoader(DATA_DIRECTORY, glob="*.txt", loader_cls=TextLoader)
    documents = loader.load()
    
    # Split text
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(documents)
    
    # Create vector store
    vectorstore = Chroma.from_documents(
        documents=splits, 
        embedding=embedding_function,
        persist_directory=PERSIST_DIRECTORY
    )
    return vectorstore

def get_agent_executor():
    """Configura e retorna o executor do agente."""
    
    # 1. Setup Vector Store & Retriever
    vectorstore = load_and_index_data()
    retriever = vectorstore.as_retriever()
    
    # 2. Setup Tools
    from langchain.tools.retriever import create_retriever_tool
    from langchain.tools import StructuredTool
    
    retriever_tool = create_retriever_tool(
        retriever,
        "search_portfolio",
        "Pesquisa informações sobre Icaro Costa, seu currículo, habilidades e sobre mim."
    )
    
    github_tool = StructuredTool.from_function(
        func=get_github_projects,
        name="github_search",
        description="Busca os projetos mais recentes do usuário no GitHub. Use isso quando perguntarem sobre projetos, código ou repositórios."
    )

    random_projects_tool = StructuredTool.from_function(
        func=get_random_projects,
        name="get_random_projects",
        description="Retorna uma lista de projetos aleatórios da pasta local. Use 'exclude' para não repetir projetos já mostrados."
    )

    project_details_tool = StructuredTool.from_function(
        func=get_project_details,
        name="get_project_details",
        description="Busca o conteúdo COMPLETO de um projeto. Use SEMPRE que o usuário mencionar o nome de um projeto (ex: 'fale sobre o Projeto X', 'WoodStock') ou pedir detalhes."
    )
    
    tools = [retriever_tool, github_tool, random_projects_tool, project_details_tool]
    
    # 3. Setup LLM (Gemini)
    llm = ChatGoogleGenerativeAI(model="gemini-flash-latest", temperature=0, convert_system_message_to_human=True)
    
    # 4. Setup Prompt
    prompt = ChatPromptTemplate.from_messages([
        ("system", """Você é o Agente de Portfólio de Icaro Costa (Informante Secreto). 
        Sua função é responder perguntas sobre o Icaro para recrutadores e visitantes.
        
        Use as ferramentas disponíveis:
        - search_portfolio: Para fatos, histórico, habilidades e informações pessoais GERAIS.
        - github_search: Para buscar projetos recentes e código no GitHub.
        - get_random_projects: Para listar projetos locais aleatórios.
        - get_project_details: OBRIGATÓRIO usar se o usuário citar o nome de um projeto específico (ex: "Projeto X", "Akademika") ou pedir "mais detalhes".
        
        IMPORTANTE - MANUTENÇÃO DE CONTEXTO:
        - Se o usuário disser apenas o nome de um projeto (ex: "o projeto x"), ENTENDA isso como um pedido para ver os detalhes desse projeto e use `get_project_details`.
        - Se o usuário perguntar "e a estrutura?", "como compila?", "quem fez?" logo após você ter falado de um projeto, ASSUMA que ele está falando do mesmo projeto e use `get_project_details` novamente.
        
        Diretrizes:
        - Seja profissional mas com um toque de "hacker" ou "informante" amigável.
        - Responda em Português (PT-BR).
        """),
        ("placeholder", "{chat_history}"),
        ("human", "{input}"),
        ("placeholder", "{agent_scratchpad}"),
    ])
    
    # 5. Create Agent
    agent = create_tool_calling_agent(llm, tools, prompt)
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
    
    return agent_executor

if __name__ == "__main__":
    # Teste
    agent = get_agent_executor()
    response = agent.invoke({"input": "Quem é o Icaro?"})
    print(response["output"])
