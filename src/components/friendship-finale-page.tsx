'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { generateNoteAction, customizeNoteAction, saveNoteAction } from '@/app/actions';
import { Confetti } from '@/components/confetti';
import { Heart, Loader2, Wand2, Copy, RefreshCw, Pencil, Send, Edit } from 'lucide-react';

type Step = 'intro' | 'generate' | 'customize' | 'final';

const generationSchema = z.object({
  recipientName: z.string().min(1, "Please enter your friend's name."),
  userName: z.string().min(1, 'Please enter your name.'),
  sharedMemory: z.string().min(10, 'Please share a more detailed memory to make the note special.'),
  includeInsideJoke: z.boolean().default(false),
});

type GenerationValues = z.infer<typeof generationSchema>;

export function FriendshipFinalePage() {
  const [step, setStep] = useState<Step>('intro');
  const [note, setNote] = useState('');
  const [generationData, setGenerationData] = useState<GenerationValues | null>(null);
  const [personalTouches, setPersonalTouches] = useState('');
  const [isEditingManually, setIsEditingManually] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<GenerationValues>({
    resolver: zodResolver(generationSchema),
    defaultValues: {
      recipientName: '',
      userName: '',
      sharedMemory: '',
      includeInsideJoke: false,
    },
  });

  const onGenerateSubmit = (values: GenerationValues) => {
    startTransition(async () => {
      setGenerationData(values);
      const result = await generateNoteAction(values);
      if (result.success && result.note) {
        setNote(result.note);
        setStep('customize');
      } else {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: result.error || 'There was a problem with our AI. Please try again.',
        });
      }
    });
  };
  
  const handleCustomize = () => {
    if (!note) return;
    startTransition(async () => {
        const result = await customizeNoteAction({ initialNote: note, personalTouches });
        if(result.success && result.note) {
            setNote(result.note);
            setStep('final');
        } else {
             toast({
                variant: 'destructive',
                title: 'Customization Failed',
                description: result.error || 'Could not customize the note. Please try again.',
            });
        }
    });
  }
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(note);
    toast({
        title: 'Note Copied!',
        description: 'Your heartfelt note is ready to be pasted.',
    });
  }
  
  const handleShare = () => {
    startTransition(async () => {
      const result = await saveNoteAction({note});
      if(result.success && result.noteId) {
        const shareUrl = `${window.location.origin}/note/${result.noteId}`;
        navigator.clipboard.writeText(shareUrl);
        toast({
            title: 'Link Copied!',
            description: 'Your shareable note link is copied to the clipboard.',
        });
      } else {
         toast({
            variant: 'destructive',
            title: 'Sharing Failed',
            description: result.error || 'Could not create a shareable link. Please try again.',
        });
      }
    });
  }

  const handleStartOver = () => {
    setNote('');
    setPersonalTouches('');
    setGenerationData(null);
    form.reset();
    setStep('intro');
  }

  const renderIntro = () => (
    <Card className="w-full max-w-lg text-center animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-5xl tracking-wide">Friendship Note</CardTitle>
        <CardDescription className="font-body text-base pt-2">
          Craft a beautiful, AI-powered note for your friend to celebrate your unique bond.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button size="lg" className="group" variant="secondary" onClick={() => setStep('generate')}>
          Create Your Note <Heart className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />
        </Button>
      </CardContent>
    </Card>
  );

  const renderGenerateForm = () => (
    <Card className="w-full max-w-lg animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Tell Us About Your Friendship</CardTitle>
        <CardDescription className="font-body">A few details will help us write the perfect note.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onGenerateSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="recipientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Friend's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Jessica" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Alex" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="sharedMemory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What's the occasion?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the occasion (e.g., a shared memory, a birthday wish, Friendship Day, etc.)" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="includeInsideJoke"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Include an inside joke?</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full group" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
              )}
              Generate Note
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
  
  const renderCustomize = () => {
    return (
    <Card className="w-full max-w-lg animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Your Draft is Ready!</CardTitle>
        <CardDescription className="font-body">Here's a start. Feel free to add your own personal touches below or edit the note directly.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditingManually ? (
            <Textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[150px] font-body text-secondary-foreground"
            />
        ) : (
            <div className="p-4 bg-secondary rounded-lg border whitespace-pre-wrap font-body text-secondary-foreground">
                {note}
            </div>
        )}
        
        {!isEditingManually && (
            <Textarea 
                placeholder="Add a personal touch... e.g., 'And don't forget about the seagulls!'" 
                className="min-h-[80px]" 
                value={personalTouches}
                onChange={(e) => setPersonalTouches(e.target.value)}
            />
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 justify-between">
          <div className="flex gap-2">
            {!isEditingManually && (
                <Button onClick={handleCustomize} className="w-full sm:w-auto group" disabled={isPending || !personalTouches}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Pencil className="mr-2 h-4 w-4 transition-transform group-hover:rotate-[-12deg]" />}
                    Make it More Personal
                </Button>
            )}
             <Button variant="outline" onClick={() => setIsEditingManually(!isEditingManually)}>
                <Edit className="mr-2 h-4 w-4"/>
                {isEditingManually ? 'Finish Editing' : 'Edit Manually'}
             </Button>
          </div>
        <Button variant="secondary" className="w-full sm:w-auto" onClick={() => { setIsEditingManually(false); setStep('final');}} disabled={isPending}>
            It's Perfect!
        </Button>
      </CardFooter>
    </Card>
  )};
  
  const renderFinal = () => (
    <>
        <Confetti />
        <Card className="w-full max-w-lg animate-in fade-in-50 duration-500">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-4xl">Your Masterpiece!</CardTitle>
            <CardDescription className="font-body">Ready to share with your friend and make their day.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="p-6 bg-secondary rounded-lg border whitespace-pre-wrap font-body text-secondary-foreground text-lg leading-relaxed shadow-inner">
                {note}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
             <div className="flex flex-col sm:flex-row gap-2 w-full">
                 <Button size="lg" className="flex-1 group" onClick={handleCopyToClipboard}>
                    <Copy className="mr-2 h-5 w-5 transition-transform group-hover:scale-110"/> Copy to Clipboard
                 </Button>
                 <Button size="lg" variant="accent" className="flex-1 group" onClick={handleShare} disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"/>}
                     Share
                 </Button>
             </div>
             <div className="flex gap-2">
                 <Button variant="ghost" onClick={() => setStep('customize')}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                 </Button>
                 <Button variant="ghost" onClick={handleStartOver}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Start Over
                 </Button>
             </div>
          </CardFooter>
        </Card>
    </>
  );


  switch (step) {
    case 'generate':
      return renderGenerateForm();
    case 'customize':
      return renderCustomize();
    case 'final':
        return renderFinal();
    case 'intro':
    default:
      return renderIntro();
  }
}
