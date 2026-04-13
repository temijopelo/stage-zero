const currentDateElement = document.querySelector(
  '[data-testid="test-current-date"]',
);
const dueDateElement = document.querySelector(
  '[data-testid="test-todo-due-date"]',
);
const timeRemainingElement = document.querySelector(
  '[data-testid="test-todo-time-remaining"]',
);
const titleElement = document.querySelector('[data-testid="test-todo-title"]');
const statusElement = document.querySelector(
  '[data-testid="test-todo-status"]',
);
const completeToggleElement = document.querySelector(
  '[data-testid="test-todo-complete-toggle"]',
);
const editButtonElement = document.querySelector(
  '[data-testid="test-todo-edit-button"]',
);
const deleteButtonElement = document.querySelector(
  '[data-testid="test-todo-delete-button"]',
);

const dueDateFromMarkup = dueDateElement?.getAttribute("datetime");
const dueDate = dueDateFromMarkup ? new Date(dueDateFromMarkup) : null;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function formatRemainingTime(milliseconds) {
  const totalMinutes = Math.floor(milliseconds / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));

  if (days === 0) {
    const minutes = totalMinutes % 60;
    return `Due in ${minutes} minutes`;
  }
  return `Due in ${days} days`;
}

function updateTaskDates() {
  const now = new Date();

  if (currentDateElement) {
    currentDateElement.dateTime = now.toISOString();
    currentDateElement.textContent = dateFormatter.format(now);
  }

  if (!dueDate || Number.isNaN(dueDate.getTime())) {
    if (dueDateElement) {
      dueDateElement.textContent = "Invalid due date";
    }
    if (timeRemainingElement) {
      timeRemainingElement.textContent = "N/A";
    }
    return;
  }

  if (dueDateElement) {
    dueDateElement.textContent = dateFormatter.format(dueDate);
  }

  const remaining = dueDate.getTime() - now.getTime();

  if (!timeRemainingElement) {
    return;
  }

  if (remaining <= 0) {
    timeRemainingElement.dateTime = "PT0M";
    timeRemainingElement.textContent = "Task is overdue";
    return;
  }

  timeRemainingElement.textContent = formatRemainingTime(remaining);
}

function updateCompletionState() {
  if (!completeToggleElement) {
    return;
  }

  const isDone = completeToggleElement.checked;

  if (titleElement) {
    titleElement.classList.toggle("title_completed", isDone);
  }

  if (statusElement) {
    statusElement.textContent = isDone ? "Done" : "In Progress";
  }
}

updateTaskDates();
setInterval(updateTaskDates, 60 * 1000);

if (completeToggleElement) {
  completeToggleElement.addEventListener("change", updateCompletionState);
}

if (editButtonElement) {
  editButtonElement.addEventListener("click", () => {
    console.log("edit clicked");
  });
}

if (deleteButtonElement) {
  deleteButtonElement.addEventListener("click", () => {
    alert("Delete clicked");
  });
}

updateCompletionState();
