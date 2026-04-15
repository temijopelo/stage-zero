const currentDateElement = document.querySelector(
  '[data-testid="test-current-date"]',
);
const dueDateElement = document.querySelector(
  '[data-testid="test-todo-due-date"]',
);
const timeRemainingElement = document.querySelector(
  '[data-testid="test-todo-time-remaining"]',
);
const overdueIndicatorElement = document.querySelector(
  '[data-testid="test-todo-overdue-indicator"]',
);
const titleElement = document.querySelector('[data-testid="test-todo-title"]');
const descElement = document.querySelector(
  '[data-testid="test-todo-description"]',
);
const toggleDescButtonElement = document.querySelector(
  '[data-testid="test-todo-expand-toggle"]',
);
const priorityElement = document.querySelector(
  '[data-testid="test-todo-priority"]',
);

const statusElement = document.querySelector(
  '[data-testid="test-todo-status"]',
);
const completeToggleElement = document.querySelector(
  '[data-testid="test-todo-complete-toggle"]',
);
const completeToggleElementLabel = document.querySelector(
  '[data-testid="test-todo-complete-label"]',
);
const editButtonElement = document.querySelector(
  '[data-testid="test-todo-edit-button"]',
);
const deleteButtonElement = document.querySelector(
  '[data-testid="test-todo-delete-button"]',
);
const saveBtn = document.querySelector('[data-testid="test-todo-save-button"]');
const cancelBtn = document.querySelector(
  '[data-testid="test-todo-cancel-button"]',
);

const titleInput = document.querySelector(
  '[data-testid="test-todo-edit-title-input"]',
);
const descInput = document.querySelector(
  '[data-testid="test-todo-edit-description-input"]',
);
const prioritySel = document.querySelector(
  '[data-testid="test-todo-edit-priority-select"]',
);
const dueDateInput = document.querySelector(
  '[data-testid="test-todo-edit-due-date-input"]',
);
const statusSel = document.querySelector(
  '[data-testid="test-todo-status-control"]',
);

const dueDateFromMarkup = dueDateElement?.getAttribute("datetime");

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

let snapshot = {};
let fullDescriptionText = "";

const MAX_LENGTH = 50;

document.querySelectorAll(".description_container").forEach((container) => {
  const desc = container.querySelector(".description");
  const toggleBtn = container.querySelector("button");

  fullDescriptionText = desc.textContent.trim();
  let isExpanded = false;

  const truncateText = (text) => {
    return text.length > MAX_LENGTH ? text.slice(0, MAX_LENGTH) + "..." : text;
  };

  desc.textContent = truncateText(fullDescriptionText);
  if (fullDescriptionText.length <= MAX_LENGTH) {
    toggleBtn.style.display = "none";
  }

  toggleBtn.addEventListener("click", () => {
    isExpanded = !isExpanded;

    desc.textContent = isExpanded
      ? fullDescriptionText
      : truncateText(fullDescriptionText);

    // Toggle icon
    toggleBtn.innerHTML = isExpanded
      ? `<i class="fa-regular fa-square-minus"></i>`
      : `<i class="fa-regular fa-square-plus"></i>`;
  });
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

function parseDueDate(value) {
  if (!value) {
    return null;
  }

  const dateOnlyMatch = /^\d{4}-\d{2}-\d{2}$/.test(value);
  if (dateOnlyMatch) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function updateTaskDates() {
  const now = new Date();
  const liveDueDateValue = dueDateElement?.getAttribute("datetime") || "";
  const dueDate = parseDueDate(liveDueDateValue);

  if (currentDateElement) {
    currentDateElement.dateTime = now.toISOString();
    currentDateElement.textContent = dateFormatter.format(now);
  }

  if (!dueDate) {
    if (dueDateElement) {
      dueDateElement.textContent = "Invalid due date";
    }
    if (timeRemainingElement) {
      timeRemainingElement.textContent = "N/A";
    }
    if (overdueIndicatorElement) {
      overdueIndicatorElement.classList.add("hidden");
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
    timeRemainingElement.textContent = "";
    if (overdueIndicatorElement) {
      overdueIndicatorElement.classList.remove("hidden");
    }
    return;
  }

  if (overdueIndicatorElement) {
    overdueIndicatorElement.classList.add("hidden");
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
    if (isDone) {
      statusElement.textContent = "Done";
      statusSel.value = "Done";
    } else if (statusElement.textContent.trim() === "Done") {
      statusElement.textContent = "Pending";
      statusSel.value = "Pending";
    }
  }

  if (isDone) {
    timeRemainingElement.textContent = "Completed";
    timeRemainingElement.dateTime = "PT0M";
    timeRemainingElement.classList.add("time_remaining_text_completed");
    timeRemainingElement.classList.remove("time_remaining_text");
    if (overdueIndicatorElement) {
      overdueIndicatorElement.classList.add("hidden");
    }
  }

  if (prioritySel.value === "High") {
    priorityElement.classList.add("priority_badge");
    priorityElement.classList.remove(
      "priority_badge_medium",
      "priority_badge_low",
    );
  } else if (prioritySel.value === "Medium") {
    priorityElement.classList.add("priority_badge_medium");
    priorityElement.classList.remove("priority_badge", "priority_badge_low");
  } else {
    priorityElement.classList.add("priority_badge_low");
    priorityElement.classList.remove("priority_badge", "priority_badge_medium");
  }
}

function toggleEditMode(isEditing) {
  titleElement.classList.toggle("hidden", isEditing);
  titleInput.classList.toggle("hidden", !isEditing);

  descElement.classList.toggle("hidden", isEditing);
  descInput.classList.toggle("hidden", !isEditing);
  toggleDescButtonElement.classList.toggle("hidden", isEditing);

  priorityElement.classList.toggle("hidden", isEditing);
  prioritySel.classList.toggle("hidden", !isEditing);

  dueDateElement.classList.toggle("hidden", isEditing);
  dueDateInput.classList.toggle("hidden", !isEditing);

  statusElement.classList.toggle("hidden", isEditing);
  statusSel.classList.toggle("hidden", !isEditing);

  completeToggleElement.classList.toggle("hidden", isEditing);
  completeToggleElementLabel.classList.toggle("hidden", isEditing);

  editButtonElement.classList.toggle("hidden", isEditing);
  saveBtn.classList.toggle("hidden", !isEditing);
  cancelBtn.classList.toggle("hidden", !isEditing);
  deleteButtonElement.classList.toggle("hidden", isEditing);
}

if (completeToggleElement) {
  completeToggleElement.addEventListener("change", updateCompletionState);
}

if (deleteButtonElement) {
  deleteButtonElement.addEventListener("click", () => {
    alert("Delete clicked");
  });
}

editButtonElement.addEventListener("click", () => {
  snapshot = {
    title: titleElement.textContent.trim(),
    desc: fullDescriptionText,
    priority: priorityElement.textContent.trim(),
    dueDate: dueDateElement.getAttribute("datetime"),
    status: statusElement.textContent.trim(),
  };

  titleInput.value = snapshot.title;
  descInput.value = snapshot.desc;
  dueDateInput.value = snapshot.dueDate ? snapshot.dueDate.split("T")[0] : "";
  prioritySel.value = snapshot.priority;
  statusSel.value = snapshot.status;

  toggleEditMode(true);
});

saveBtn.addEventListener("click", () => {
  titleElement.textContent = titleInput.value;
  fullDescriptionText = descInput.value.trim();
  descElement.textContent = fullDescriptionText;
  priorityElement.textContent = prioritySel.value;
  statusElement.textContent = statusSel.value;
  completeToggleElement.checked = statusSel.value === "Done";
  dueDateElement.textContent = dueDateInput.value;
  dueDateElement.setAttribute("datetime", dueDateInput.value);

  toggleEditMode(false);
  updateTaskDates();
  updateCompletionState();
});

cancelBtn.addEventListener("click", () => {
  titleElement.textContent = snapshot.title;
  fullDescriptionText = snapshot.desc;
  descElement.textContent = fullDescriptionText;
  priorityElement.textContent = snapshot.priority;
  statusElement.textContent = snapshot.status;

  toggleEditMode(false);
});

updateCompletionState();
updateTaskDates();
setInterval(updateTaskDates, 60 * 1000);
