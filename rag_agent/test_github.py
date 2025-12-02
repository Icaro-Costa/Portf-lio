from github_tool import get_github_projects
from dotenv import load_dotenv
import os

load_dotenv()

print("Testando ferramenta do GitHub...")
token = os.getenv("GITHUB_TOKEN")
if not token:
    print("ERRO: GITHUB_TOKEN não encontrado no .env")
elif token == "ghp_seu_token_aqui":
    print("ERRO: O token ainda é o placeholder. Por favor, coloque seu token real.")
else:
    print(f"Token encontrado: {token[:4]}...{token[-4:]}")
    try:
        resultado = get_github_projects()
        print("\nResultado da busca:")
        print(resultado)
    except Exception as e:
        print(f"\nErro ao executar a função: {e}")
