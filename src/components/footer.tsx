import Link from 'next/link';
import { Github, Linkedin, Instagram, Mail } from 'lucide-react';

export function Footer() {
    return (
        <footer className="w-full text-center py-4 mt-auto">
            <p className="text-muted-foreground font-headline text-lg">Created with ❤️ by Ram Rajurkar</p>
            <div className="flex justify-center gap-4 mt-2">
                <Link href="https://github.com/RamRajurkar/Friendship-Note-AI-web-app" className="text-muted-foreground hover:text-foreground transition-colors"><Github size={20}/></Link>
                <Link href="https://www.instagram.com/ram_rajurkar_007?igsh=MXJ4anJkaXVyNG5qdQ==" className="text-muted-foreground hover:text-foreground transition-colors"><Instagram size={20}/></Link>
                <Link href="https://www.linkedin.com/in/ram-rajurkar-647b90258/" className="text-muted-foreground hover:text-foreground transition-colors"><Linkedin size={20}/></Link>
                <Link href="mailto:ram.s.rajurkar@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors"><Mail size={20}/></Link>
            </div>
        </footer>
    );
}
