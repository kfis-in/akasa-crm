import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  Home, 
  Users, 
  Plus, 
  BarChart3, 
  Settings, 
  FileText,
  Target,
  TrendingUp,
  Shield 
} from 'lucide-react'
import { useUserRole } from '@/hooks/useUserRole'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "All Leads", url: "/leads", icon: Users },
  { title: "Add Lead", url: "/leads/new", icon: Plus },
]

const analyticsItems = [
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Pipeline", url: "/pipeline", icon: Target },
  { title: "Performance", url: "/performance", icon: TrendingUp },
]

const settingsItems = [
  { title: "Export Data", url: "/export-data", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function CRMSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const { isAdmin, role } = useUserRole()
  
  const isCollapsed = state === "collapsed"
  
  const isActive = (path: string) => currentPath === path
  const getNavClass = (path: string) => 
    `transition-smooth ${isActive(path) 
      ? "bg-sidebar-accent text-sidebar-primary font-medium shadow-sm" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
    }`

  return (
    <Sidebar className={`${isCollapsed ? "w-14" : "w-64"} border-r border-sidebar-border bg-sidebar`}>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-primary rounded-lg h-8 w-8 flex items-center justify-center">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-sidebar-primary">Lead CRM</h1>
              <p className="text-xs text-sidebar-foreground/70">Manage your pipeline</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 uppercase tracking-wider text-xs font-semibold">
            {!isCollapsed && "Main"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavClass(item.url)}
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 uppercase tracking-wider text-xs font-semibold">
            {!isCollapsed && "Analytics"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavClass(item.url)}
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 uppercase tracking-wider text-xs font-semibold">
            {!isCollapsed && "Tools"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavClass(item.url)}
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/60 uppercase tracking-wider text-xs font-semibold">
              {!isCollapsed && "Admin"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink 
                      to="/admin" 
                      end 
                      className={getNavClass("/admin")}
                    >
                      <Shield className="h-5 w-5" />
                      {!isCollapsed && <span className="ml-3">Admin Panel</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  )
}