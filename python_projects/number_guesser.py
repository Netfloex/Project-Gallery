import random

def number_guessing_game():
    number = random.randint(1, 10)
    attempts = 0
    print("Guess the number between 1 and 10!")

    while True:
        guess = input("Your guess: ")
        if not guess.isdigit():
            print("Please enter a valid number.")
            continue

        guess = int(guess)
        attempts += 1

        if guess < number:
            print("Too low!")
        elif guess > number:
            print("Too high!")
        else:
            print(f"Correct! The number was {number}. Attempts: {attempts}")
            break

number_guessing_game()
