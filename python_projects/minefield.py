import random

def minefield():
    print("Minefield! Choose a number between 1 and 10. Avoid the bomb!")
    bomb = random.randint(1, 10)

    while True:
        try:
            choice = int(input("Pick a number: "))
            if choice == bomb:
                print(choice, "Boom! You hit the bomb!")
                break
            elif 1 <= choice <= 10:
                print(choice, "Safe! Try again.")
            else:
                print("Pick a number between 1 and 10.")
        except ValueError:
            print("Enter a valid number.")

minefield()
