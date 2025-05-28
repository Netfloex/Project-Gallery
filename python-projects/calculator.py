def calculator():
    print("Welcome to the interactive calculator!")
    print("Type 'exit' to quit.")
    while True:
        user_input = input("Enter calculation (e.g., 2 + 2): ")
        if user_input.lower() == 'exit':
            break
        try:
            result = eval(user_input)
            print(f"Result: {result}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    calculator()
