export default function Page({ params }: { params: { id: string } }) {
  console.log("PARAMS:", params);
  return <div>Salida IDssss: {params?.id}</div>;
}
