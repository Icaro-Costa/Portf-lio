import os
from github import Github
from dotenv import load_dotenv

load_dotenv()

def get_github_projects(username: str = "Icaro-Costa", n_repos: int = 5) -> str:
    """Busca os últimos N repositórios de um usuário no GitHub."""
    # Sanitize username: remove spaces if present, or force the default if it looks like a full name
    if " " in username:
        username = "Icaro-Costa"
    token = os.getenv("GITHUB_TOKEN")
    if not token:
        return "Erro: Token do GitHub não configurado (GITHUB_TOKEN)."

    try:
        g = Github(token)
        user = g.get_user(username)
        repos = user.get_repos(sort="updated", direction="desc")

        output = f"Meus últimos projetos no GitHub ({username}):\n"
        count = 0
        for repo in repos:
            if count >= n_repos:
                break
            # Skip forked repos if desired, or keep them. keeping them for now.
            output += f"- {repo.name}: {repo.description or 'Sem descrição'} (Linguagem: {repo.language}, Stars: {repo.stargazers_count})\n"
            count += 1
        return output
    except Exception as e:
        return f"Erro ao acessar o GitHub: {e}"

if __name__ == "__main__":
    # Teste local
    print(get_github_projects())
