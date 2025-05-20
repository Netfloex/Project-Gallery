import random

def rps():
    choices = ["rock", "paper", "scissors"]
    print("🎮 Rock, Paper, Scissors! (type 'quit' to stop)")

    while True:
        user = input("Your choice: ").lower()
        if user == "quit":
            break
        if user not in choices:
            print("Invalid choice.")
            continue

        comp = random.choice(choices)
        print(f"Computer chose: {comp}")

        if user == comp:
            print("🤝 It's a tie!")
        elif (user == "rock" and comp == "scissors") or \
             (user == "paper" and comp == "rock") or \
             (user == "scissors" and comp == "paper"):
            print("🎉 You win!")
        else:
            print("💻 Computer wins!")

rps()
