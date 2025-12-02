import os
import random
from typing import List, Optional

PROJECTS_DIR = os.path.join(os.path.dirname(__file__), "data", "projects")

def get_random_projects(n: int = 5, exclude: Optional[List[str]] = None) -> str:
    """
    Retorna uma lista de N projetos aleatórios da pasta local.
    Pode excluir projetos já mostrados anteriormente.
    """
    if exclude is None:
        exclude = []
        
    try:
        if not os.path.exists(PROJECTS_DIR):
            return "Diretório de projetos não encontrado."

        files = [f for f in os.listdir(PROJECTS_DIR) if f.endswith(".txt")]
        
        # Filter out excluded projects (checking filename without extension)
        available_files = [f for f in files if f.replace(".txt", "") not in exclude]
        
        if not available_files:
            if not files:
                return "Nenhum projeto encontrado na pasta."
            return "Todos os projetos disponíveis já foram mostrados. Peça para listar todos novamente se quiser."

        # Select random files
        selected_files = random.sample(available_files, min(n, len(available_files)))
        
        output = "Projetos Encontrados:\n"
        for f in selected_files:
            path = os.path.join(PROJECTS_DIR, f)
            with open(path, "r", encoding="utf-8") as file:
                # Read first few lines for summary
                content = file.read().strip()
                summary = content.split("\n")[0] # Assume first line is title/summary
                output += f"- {f.replace('.txt', '')}: {summary}\n"
        
        return output

    except Exception as e:
        return f"Erro ao buscar projetos: {e}"

def get_project_details(project_name: str) -> str:
    """
    Busca o conteúdo completo de um projeto específico pelo nome.
    """
    try:
        if not os.path.exists(PROJECTS_DIR):
            return "Diretório de projetos não encontrado."
            
        files = [f for f in os.listdir(PROJECTS_DIR) if f.endswith(".txt")]
        
        # Fuzzy search: normalize and check inclusion
        match = None
        for f in files:
            # Normalize: lowercase, replace - and _ with space
            name_norm = f.replace(".txt", "").lower().replace("-", " ").replace("_", " ")
            query_norm = project_name.lower().replace("-", " ").replace("_", " ")
            
            if query_norm in name_norm or name_norm in query_norm:
                match = f
                break
        
        if not match:
            return f"Projeto '{project_name}' não encontrado."
            
        path = os.path.join(PROJECTS_DIR, match)
        with open(path, "r", encoding="utf-8") as file:
            return file.read()
            
    except Exception as e:
        return f"Erro ao ler projeto: {e}"
