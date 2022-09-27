export function FormContainer(props: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden">
      <div className="p-5 lg:p-6 flex-grow w-full">
        <div className="sm:p-5 lg:px-10 lg:py-8"></div>
        {props.children}
      </div>
    </div>
  );
}
