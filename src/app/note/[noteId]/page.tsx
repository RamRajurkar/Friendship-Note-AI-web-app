import { getNote } from '@/services/note-service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function SharedNotePage({ params }: { params: { noteId: string } }) {
  const note = await getNote(params.noteId);

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-background p-4 font-body">
      <Card className="w-full max-w-2xl text-center shadow-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-4xl tracking-wide">A Note For You</CardTitle>
          <CardDescription>Someone wanted to share this with you!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {note ? (
            <div className="p-6 bg-secondary rounded-lg border whitespace-pre-wrap text-secondary-foreground text-lg leading-relaxed shadow-inner">
              {note}
            </div>
          ) : (
            <p className="text-destructive-foreground">This note could not be found. It might have expired.</p>
          )}
           <Button asChild variant="secondary" size="lg" className="group">
             <Link href="/">
                Create Your Own Note <Heart className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
