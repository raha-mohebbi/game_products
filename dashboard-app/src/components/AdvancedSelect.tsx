"use client";

import { Fragment, useMemo, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import FixedSizeList from "react-window/dist/react-window.cjs";

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

 //filtering logic based on search query
  const filteredOptions = useMemo(() => {
    return options.filter((o) =>
      o.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [options, query]);

//grouping logic based on the "group" property of options
  const groupedOptions = useMemo(() => {
    const groups: Record<string, Option[]> = {};

    filteredOptions.forEach((option) => {
      const groupName = option.group || "Other";
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(option);
    });

    return groups;
  }, [filteredOptions]);

//selection logic for toggling optionsand handling "Select All" / "Clear" actions
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

//button label logic to show selected options or count of selected items
  const renderButtonLabel = () => {
    if (value.length === 0) return placeholder;

    if (value.length <= 3) {
      return value.map((v) => v.label).join(", ");
    }

    return `${value.length} selected`;
  };

//highlighting logic to emphasize matched text in options based on search query
  const highlightText = (text: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-200">
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
    <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md border focus:outline-none focus:ring-2 focus:ring-blue-500">
      <span className="block truncate">{renderButtonLabel()}</span>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
      </span>
    </Listbox.Button>

    <Transition
      as={Fragment}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Listbox.Options className="absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">

        <div className="px-3 py-2 sticky top-0 bg-white z-10">
          <input
            type="text"
            placeholder="Search..."
            className="w-full border rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex justify-between px-3 py-1 text-xs text-blue-600 sticky top-[52px] bg-white z-10">
          <button
            disabled={allSelected}
            className="disabled:opacity-40"
            onClick={selectAll}
          >
            Select All
          </button>
          <button onClick={clearAll}>Clear</button>
        </div>

        {Object.entries(groupedOptions).map(([groupName, items]) => (
          <div key={groupName}>
            <div className="px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-50 sticky top-[76px]">
              {groupName}
            </div>

            {items.map((option) => (
              <Listbox.Option
                key={option.id}
                value={option}
                className={({ active }) =>
                  `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                    active ? "bg-blue-100" : ""
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span>{highlightText(option.label)}</span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
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
          <div className="px-4 py-2 text-sm text-gray-500">No results found</div>
        )}
      </Listbox.Options>
    </Transition>
  </div>
</Listbox>
    </div>
  );
}
