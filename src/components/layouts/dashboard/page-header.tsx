"use client"

import Link from "next/link"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NotificationsPanel } from "@/features/notification"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Icons } from "@/components/ui/icons"

const user = {
  name: "Oluwanifemi Osunsanya",
  avatar: "/avatars/shadcn.jpg",
}

export type PageHeaderProps = {
  title: string
  description: string
  breadcrumbs: {
    label: string
    href?: string
  }[]
}

export function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <header className="shrink-0 border-b border-border/60 bg-background">
      <div className="flex flex-col gap-4 px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 lg:hidden" />
              <Breadcrumb>
                <BreadcrumbList className="text-sm text-muted-foreground">
                  {breadcrumbs.map((crumb, index) => (
                    <span key={crumb.label} className="contents">
                      {index > 0 ? <BreadcrumbSeparator /> : null}
                      <BreadcrumbItem>
                        {crumb.href ? (
                          <BreadcrumbLink asChild>
                            <Link href={crumb.href}>{crumb.label}</Link>
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                    </span>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {title}
              </h1>
              <p className="mt-1 max-w-3xl text-sm text-muted-foreground md:text-base">
                {description}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 self-end lg:self-start">
            <div className="hidden sm:block">
              <Input
                type="search"
                icon={{ name: "search", position: "left" }}
                placeholder="Search for orders, details r..."
                className="h-10 w-56 lg:w-64"
              />
            </div>
            <NotificationsPanel
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Notifications"
                >
                  <Icons.notifications size={20} />
                  <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
                </Button>
              }
            />
            <Avatar className="size-9">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>OO</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}
