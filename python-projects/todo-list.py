tasks = []

def display_tasks():
    if not tasks:
        print("No tasks in the list.")
    else:
        print("Tasks:")
        for i, task in enumerate(tasks, 1):
            print(f"{i}. {task}")

def todo_list():
    print("Welcome to the interactive to-do list!")
    print("Commands: add <task>, remove <task_number>, view, exit")
    while True:
        command = input("Enter command: ")
        if command.lower() == 'exit':
            break
        elif command.startswith("add "):
            task = command[4:]
            tasks.append(task)
            print(f"Added task: {task}")
        elif command.startswith("remove "):
            try:
                task_number = int(command.split()[1]) - 1
                removed_task = tasks.pop(task_number)
                print(f"Removed task: {removed_task}")
            except (IndexError, ValueError):
                print("Invalid task number.")
        elif command == "view":
            display_tasks()
        else:
            print("Invalid command.")

if __name__ == "__main__":
    todo_list()
