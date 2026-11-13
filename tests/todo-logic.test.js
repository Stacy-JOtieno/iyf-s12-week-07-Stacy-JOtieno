import { describe, it, expect } from "vitest";
import {
    FILTER_ALL,
    FILTER_ACTIVE,
    FILTER_COMPLETED,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    filterTodos,
    countRemaining,
    hasCompleted,
    getNextId,
    sanitizeTodos,
} from "../js/todo-logic.js";

// A fresh list for every test, so one test can never affect another
function makeTodos() {
    return [
        { id: 1, text: "Buy milk", completed: false },
        { id: 2, text: "Study circuits", completed: true },
        { id: 3, text: "Call Mum", completed: false },
    ];
}

const idsOf = (todos) => todos.map((todo) => todo.id);

describe("addTodo", () => {
    it("adds a trimmed, incomplete todo with the next id", () => {
        const result = addTodo(makeTodos(), "  Wash dishes ");
        expect(result).toHaveLength(4);
        expect(result[3]).toEqual({ id: 4, text: "Wash dishes", completed: false });
    });

    it("ignores empty or whitespace-only text (edge case)", () => {
        expect(addTodo(makeTodos(), "   ")).toEqual(makeTodos());
    });

    it("works on an empty list (edge case)", () => {
        expect(addTodo([], "First")).toEqual([{ id: 1, text: "First", completed: false }]);
    });
});

describe("toggleTodo", () => {
    it("flips only the matching todo", () => {
        const result = toggleTodo(makeTodos(), 1);
        expect(result[0].completed).toBe(true);
        expect(result[1].completed).toBe(true); // was already true, untouched
        expect(result[2].completed).toBe(false);
    });

    it("returns to the original after toggling twice", () => {
        const result = toggleTodo(toggleTodo(makeTodos(), 1), 1);
        expect(result).toEqual(makeTodos());
    });

    it("changes nothing for an id that doesn't exist (edge case)", () => {
        expect(toggleTodo(makeTodos(), 99)).toEqual(makeTodos());
    });
});

describe("deleteTodo", () => {
    it("removes only the matching todo", () => {
        expect(idsOf(deleteTodo(makeTodos(), 2))).toEqual([1, 3]);
    });

    it("changes nothing for an id that doesn't exist (edge case)", () => {
        expect(deleteTodo(makeTodos(), 99)).toEqual(makeTodos());
    });
});

describe("editTodo", () => {
    it("updates and trims the text", () => {
        const result = editTodo(makeTodos(), 1, "  Buy bread  ");
        expect(result[0].text).toBe("Buy bread");
    });

    it("removes the todo when the new text is empty (edge case)", () => {
        expect(idsOf(editTodo(makeTodos(), 1, "   "))).toEqual([2, 3]);
    });
});

describe("clearCompleted", () => {
    it("removes completed todos and keeps active ones", () => {
        expect(idsOf(clearCompleted(makeTodos()))).toEqual([1, 3]);
    });
});

describe("filterTodos", () => {
    it("returns only active todos", () => {
        expect(idsOf(filterTodos(makeTodos(), FILTER_ACTIVE))).toEqual([1, 3]);
    });

    it("returns only completed todos", () => {
        expect(idsOf(filterTodos(makeTodos(), FILTER_COMPLETED))).toEqual([2]);
    });

    it("returns everything for 'all' and for an unknown filter", () => {
        expect(idsOf(filterTodos(makeTodos(), FILTER_ALL))).toEqual([1, 2, 3]);
        expect(idsOf(filterTodos(makeTodos(), "nonsense"))).toEqual([1, 2, 3]);
    });
});

describe("countRemaining and hasCompleted", () => {
    it("counts the todos that are not completed", () => {
        expect(countRemaining(makeTodos())).toBe(2);
    });

    it("returns 0 and false for an empty list (edge case)", () => {
        expect(countRemaining([])).toBe(0);
        expect(hasCompleted([])).toBe(false);
    });

    it("detects whether any todo is completed", () => {
        expect(hasCompleted(makeTodos())).toBe(true);
    });
});

describe("getNextId", () => {
    it("starts at 1 for an empty list", () => {
        expect(getNextId([])).toBe(1);
    });

    it("goes one past the highest id, even with gaps", () => {
        expect(getNextId([{ id: 2 }, { id: 7 }, { id: 5 }])).toBe(8);
    });
});

describe("sanitizeTodos", () => {
    it("keeps valid todos and drops malformed ones", () => {
        const valid = { id: 1, text: "Keep me", completed: false };
        const input = [
            valid,
            { id: "x", text: "bad id", completed: false },
            null,
            "just a string",
            { id: 5, text: "bad completed", completed: "yes" },
        ];
        expect(sanitizeTodos(input)).toEqual([valid]);
    });

    it("returns an empty list when the saved data is not an array", () => {
        expect(sanitizeTodos(null)).toEqual([]);
        expect(sanitizeTodos("abc")).toEqual([]);
        expect(sanitizeTodos({})).toEqual([]);
    });
});

describe("purity: the original array is never changed", () => {
    it("leaves the original unchanged after every operation", () => {
        const original = makeTodos();
        const snapshot = structuredClone(original);

        addTodo(original, "New task");
        toggleTodo(original, 1);
        deleteTodo(original, 2);
        editTodo(original, 3, "Changed");
        clearCompleted(original);
        filterTodos(original, FILTER_ACTIVE);

        expect(original).toEqual(snapshot);
    });

    it("never tries to change a frozen array", () => {
        // Modules run in strict mode, so changing a frozen array throws a TypeError
        const frozen = Object.freeze(makeTodos().map((todo) => Object.freeze(todo)));

        expect(() => {
            addTodo(frozen, "New task");
            toggleTodo(frozen, 1);
            deleteTodo(frozen, 2);
            editTodo(frozen, 3, "Changed");
            clearCompleted(frozen);
        }).not.toThrow();
    });
});
