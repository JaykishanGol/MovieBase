
'use client';

import Link from 'next/link';
import { Clapperboard, User, Menu, X } from 'lucide-react';
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home', auth: false },
    { href: '/lists', label: 'My Lists', auth: true },
    { href: '/import', label: 'Import', auth: true },
  ];

  const NavLinkItems = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {navLinks.map(
        (link) =>
          (!link.auth || (link.auth && user)) && (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => isMobile && setIsMobileMenuOpen(false)}
              className={cn(
                'transition-colors hover:text-primary',
                pathname === link.href ||
                  (link.href === '/lists' && pathname.startsWith('/list/'))
                  ? 'text-primary'
                  : 'text-foreground/60',
                isMobile && 'block py-2 text-lg'
              )}
            >
              {link.label}
            </Link>
          )
      )}
      <div className={cn(isMobile ? 'pt-2' : 'flex items-center')}>
        <GenreDropdown media_type="movie" />
      </div>
      <div className={cn(isMobile ? 'pt-2' : 'flex items-center')}>
        <GenreDropdown media_type="tv" />
      </div>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Clapperboard className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">MovieBase</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <NavLinkItems />
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="hidden sm:block">
            <Search />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar className="h-8 w-8">
                  {user && (
                    <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.name || 'User'}/>
                  )}
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
                      <span>{user.user_metadata.name || user.email}</span>
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
                  <DropdownMenuItem asChild>
                    <Link href="/login">Sign In</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs">
                <div className="flex justify-between items-center py-2 border-b mb-4">
                     <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-2">
                        <Clapperboard className="h-6 w-6 text-primary" />
                        <span className="font-bold font-headline">MovieBase</span>
                    </Link>
                    <SheetClose asChild>
                        <Button variant="ghost" size="icon">
                            <X />
                            <span className="sr-only">Close menu</span>
                        </Button>
                    </SheetClose>
                </div>
                <div className="flex sm:hidden mb-4">
                  <Search />
                </div>
                <nav className="flex flex-col space-y-4">
                    <NavLinkItems isMobile={true} />
                </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
