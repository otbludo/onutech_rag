from src.rag.generator import generate_answer

def run_test():
    question = "Quels sont les principaux concepts de l'Internet des objets mentionnés dans le cours ?"
    print(f"Question posée : {question}")
    
    try:
        response = generate_answer(question)
        print("\n--- Réponse du Bot ---")
        print(response['answer'])
        print("\n--- Sources citées ---")
        for source in response['sources']:
            print(f"- {source}")
    except Exception as e:
        print(f"Erreur lors de la génération : {e}")

if __name__ == "__main__":
    run_test()