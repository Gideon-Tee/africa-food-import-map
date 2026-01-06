import type { ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
    sidebar: ReactNode;
}

export function MainLayout({ children, sidebar }: MainLayoutProps) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-gray-50">
            {/* Primary Content (Map) */}
            <main className="flex-1 relative z-0">
                {children}
            </main>

            {/* Secondary Content (Sidebar/Panel) */}
            <aside className="w-96 lg:w-[450px] flex-shrink-0 bg-white border-l border-gray-200 shadow-xl z-10 flex flex-col h-full overflow-hidden transition-all duration-300">
                {sidebar}
            </aside>
        </div>
    );
}
