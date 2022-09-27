export function Checkbox(props: { name: string; label: string }) {
  return (
    <label className="flex items-center">
      <input
        type="checkbox"
        name={props.name}
        className="border border-gray-200 rounded h-4 w-4 text-indigo-500 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
      />
      <span className="ml-2">{props.label}</span>
    </label>
  );
}
