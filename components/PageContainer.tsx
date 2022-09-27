export interface PageProps {
  children: React.ReactNode;
}
export default function PageContainer({ children, ...delegated }: PageProps) {
  return (
    <div {...delegated}>
      <div
        id="page-container"
        className="flex flex-col mx-auto w-full min-h-screen bg-gray-100"
      >
        <main id="page-content" className="flex flex-auto flex-col max-w-full">
          {children}
        </main>
      </div>
      );
    </div>
  );
}
