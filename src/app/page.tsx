import ItemsList from "./components/items-list";

export default function Home() {
  return (
    <div className="p-8">
      <div className="container max-w-[480px] mx-auto my-10">
        <h2 className="text-2xl font-bold">Items</h2>
        <ItemsList />
      </div>
    </div>
  );
}
