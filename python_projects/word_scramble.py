import random

words = ["python", "variable", "function", "loop", "dictionary"]

def scramble_game():
    word = random.choice(words)
    scrambled = ''.join(random.sample(word, len(word)))

    print(f"🔀 Unscramble the word: {scrambled}")
    guess = input("Your guess: ").strip().lower()

    if guess == word:
        print("🎉 Correct!")
    else:
        print(f"Oops! The correct word was '{word}'.")

scramble_game()
