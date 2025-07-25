
'use client';

import Link from 'next/link';
import { Clapperboard } from 'lucide-react';
import Search from './Search';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import GenreDropdown from './GenreDropdown';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { user, signIn, signOut } = useAuth();

  const navLinks = [
    { href: '/', label: 'Home', auth: false },
    { href: '/lists', label: 'My Lists', auth: true },
    { href: '/import', label: 'Import', auth: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Clapperboard className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">MovieBase</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navLinks.map(
            (link) =>
              (!link.auth || (link.auth && user)) && (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'transition-colors hover:text-primary',
                    pathname === link.href ||
                      (link.href === '/lists' &&
                        pathname.startsWith('/list/'))
                      ? 'text-primary'
                      : 'text-foreground/60'
                  )}
                >
                  {link.label}
                </Link>
              )
          )}
          <GenreDropdown media_type="movie" />
          <GenreDropdown media_type="tv" />
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Search />
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user ? (
                  <>
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{user.displayName}</span>
                        <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => signIn()}>
                      Sign In
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => signIn()}>
                      Sign Up
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
