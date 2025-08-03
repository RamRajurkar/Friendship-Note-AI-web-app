import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
    return (
        <footer className="w-full text-center py-4 mt-auto">
            <p className="text-muted-foreground font-headline text-lg">Created with ❤️ by Ram Rajurkar</p>
            <div className="flex justify-center gap-4 mt-2">
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Github size={20}/></Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Twitter size={20}/></Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Linkedin size={20}/></Link>
            </div>
        </footer>
    );
}
