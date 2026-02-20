"use client";

import { Fragment, useMemo, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

type Option = {
  id: string | number;
  label: string;
  group?: string;
};

interface AdvancedSelectProps {
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  placeholder?: string;
}

export default function AdvancedSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
}: AdvancedSelectProps) {
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    return options.filter((o) =>
      o.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [options, query]);

  const groupedOptions = useMemo(() => {
    const groups: Record<string, Option[]> = {};
    filteredOptions.forEach((option) => {
      const groupName = option.group || "Other";
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(option);
    });
    return groups;
  }, [filteredOptions]);

  const isSelected = (option: Option) =>
    value.some((v) => v.id === option.id);

  const toggleOption = (option: Option) => {
    if (isSelected(option)) {
      onChange(value.filter((v) => v.id !== option.id));
    } else {
      onChange([...value, option]);
    }
  };

  const selectAll = () => {
    onChange(filteredOptions);
  };

  const clearAll = () => {
    onChange([]);
  };

  const allSelected =
    filteredOptions.length > 0 &&
    filteredOptions.every((opt) => isSelected(opt));

  const renderButtonLabel = () => {
    if (value.length === 0) return placeholder;
    if (value.length <= 3) return value.map((v) => v.label).join(", ");
    return `${value.length} selected`;
  };

  const highlightText = (text: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-purple-600/40 text-pink-300 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="w-full max-w-md">
      <Listbox value={value} onChange={onChange} multiple>
        <div className="relative mt-1">

          {/* Button */}
          <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-white/5 backdrop-blur-xl py-3 pl-4 pr-10 text-left text-white border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
            <span className="block truncate">
              {renderButtonLabel()}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronUpDownIcon className="h-5 w-5 text-purple-400" />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-20 mt-2 max-h-96 w-full overflow-auto rounded-2xl bg-black/90 backdrop-blur-xl py-2 text-sm shadow-[0_0_30px_rgba(168,85,247,0.3)] border border-purple-500/30">

              {/* Search */}
              <div className="px-4 pb-2 sticky top-0 bg-black/95 backdrop-blur-xl z-20">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full rounded-lg bg-white/5 border border-purple-500/30 px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              {/* Select / Clear */}
              <div className="flex justify-between px-4 py-2 text-xs text-purple-400 sticky top-[56px] bg-black/95 z-20">
                <button
                  disabled={allSelected}
                  className="hover:text-pink-400 disabled:opacity-40 transition"
                  onClick={selectAll}
                >
                  Select All
                </button>
                <button
                  onClick={clearAll}
                  className="hover:text-pink-400 transition"
                >
                  Clear
                </button>
              </div>

              {Object.entries(groupedOptions).map(([groupName, items]) => (
                <div key={groupName}>
                  <div className="px-4 py-1 text-xs font-semibold text-purple-300 bg-purple-500/10 sticky top-[84px]">
                    {groupName}
                  </div>

                  {items.map((option) => (
                    <Listbox.Option
                      key={option.id}
                      value={option}
                      className={({ active }) =>
                        `cursor-pointer select-none relative py-2 pl-10 pr-4 transition ${
                          active
                            ? "bg-gradient-to-r from-purple-600/30 to-pink-600/30"
                            : ""
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className="text-gray-200">
                            {highlightText(option.label)}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-400">
                              <CheckIcon className="h-5 w-5" />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </div>
              ))}

              {filteredOptions.length === 0 && (
                <div className="px-4 py-3 text-gray-400 text-sm">
                  No results found
                </div>
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}