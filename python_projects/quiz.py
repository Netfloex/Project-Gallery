questions = {
    "What is the capital of France? ": "paris",
    "Who wrote 'Romeo and Juliet'? ": "shakespeare",
    "What is 9 * 9? ": "81"
}

def quiz_game():
    score = 0
    for q, a in questions.items():
        user_answer = input(q).lower().strip()
        if user_answer == a:
            print("✅ Correct!")
            score += 1
        else:
            print(f"❌ Wrong! The correct answer is '{a}'")
    print(f"\nYour final score: {score}/{len(questions)}")

quiz_game()
