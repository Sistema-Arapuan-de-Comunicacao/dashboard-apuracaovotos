import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <main className="flex flex-col items-center gap-5 p-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Presidente</CardTitle>
        </CardHeader>
        <CardContent>
          
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Governador</CardTitle>
        </CardHeader>
      </Card>
      <div className="w-full flex items-center gap-5">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Deputado Federal</CardTitle>
          </CardHeader>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Deputado Estadual</CardTitle>
          </CardHeader>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Senador</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </main>
  )
}

type CandidateProps = {
  id: string;
  imgPath: string;
  name: string;
  party: string;
  votes: number;
}

function Candidate({}: CandidateProps) {
  return (
    <></>
  );
}