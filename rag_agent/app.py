import streamlit as st
from rag_engine import get_agent_executor
from dotenv import load_dotenv
import os
from langchain_core.messages import HumanMessage, AIMessage

# Load environment variables
load_dotenv()

# Page Config
# Page Config
st.set_page_config(
    page_title="Informante Secreto - Icaro Costa",
    page_icon="🕵️",
    layout="centered"
)

# Custom CSS for Cyberpunk/Hacker Theme
st.markdown("""
<style>
    .stApp {
        background-color: #0d1117;
        color: #00ff41;
        font-family: 'Courier New', Courier, monospace;
    }
    
    /* Hide Streamlit elements */
    #MainMenu {visibility: hidden;}
    header {visibility: hidden;}
    footer {visibility: hidden;}
    .stDeployButton {display: none;}
    
    .stTextInput > div > div > input {
        background-color: #161b22;
        color: #00ff41;
        border: 1px solid #00ff41;
    }
    .stChatMessage {
        background-color: #161b22;
        border: 1px solid #30363d;
    }
    h1 {
        color: #00ff41;
        text-shadow: 0 0 10px #00ff41;
    }
    .stButton button {
        background-color: #238636;
        color: white;
        border: none;
    }
</style>
""", unsafe_allow_html=True)

st.title("🕵️ Informante Secreto")
st.caption("Acesse os arquivos confidenciais de Icaro Costa.")


# Initialize Agent
if "agent" not in st.session_state:
    with st.spinner("Estabelecendo conexão segura..."):
        try:
            st.session_state.agent = get_agent_executor()
            st.success("Conexão estabelecida.")
        except Exception as e:
            st.error(f"Falha na conexão: {e}")
            st.stop()

# Initialize Chat History
if "messages" not in st.session_state:
    st.session_state.messages = [
        {"role": "assistant", "content": "Conexão segura estabelecida. O que você quer saber sobre o alvo (Icaro)?"}
    ]

# Display Chat
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# User Input
if prompt := st.chat_input("Digite sua pergunta..."):
    # Add user message
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)
    
    # Generate response
    with st.chat_message("assistant"):
        with st.spinner("Descriptografando resposta..."):
            try:
                # Format history
                chat_history = []
                for msg in st.session_state.messages:
                    if msg["role"] == "user":
                        chat_history.append(HumanMessage(content=msg["content"]))
                    elif msg["role"] == "assistant":
                        chat_history.append(AIMessage(content=msg["content"]))
                
                # Keep only last 10 messages to avoid context limit issues
                chat_history = chat_history[-10:]
                
                response = st.session_state.agent.invoke({"input": prompt, "chat_history": chat_history})
                output_text = response["output"]
                st.markdown(output_text)
                st.session_state.messages.append({"role": "assistant", "content": output_text})
            except Exception as e:
                st.error(f"Erro no sistema: {e}")

