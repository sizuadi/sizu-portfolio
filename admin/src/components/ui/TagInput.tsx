/**
 * Tag Input — input array of strings (skills, techs, tags)
 */

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  label?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ label, value, onChange, placeholder = "Ketik lalu tekan Enter..." }: TagInputProps) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  };

  const remove = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="min-h-[2.5rem] flex flex-wrap gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded"
          >
            {tag}
            <button
              type="button"
              onClick={() => remove(tag)}
              className="hover:text-indigo-900"
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={add}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[8rem] outline-none text-sm text-gray-900 placeholder:text-gray-400 bg-transparent"
        />
      </div>
      <p className="text-xs text-gray-500">Tekan Enter untuk menambahkan</p>
    </div>
  );
}
