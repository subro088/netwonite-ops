import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { DashboardLayout } from './components/layout/DashboardLayout.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { EmployeeDashboard } from './pages/EmployeeDashboard.tsx';
import { ManageTeamsPage } from './pages/ManageTeamsPage.tsx';
import { ManageUsersPage } from './pages/ManageUsersPage.tsx';
import { TasksPage } from './pages/TasksPage.tsx';
import { TaskDetailsPage } from './pages/TaskDetailsPage.tsx';
import { MyTeamLeaderPage } from './pages/MyTeamLeaderPage.tsx';
import { MyTeamMemberPage } from './pages/MyTeamMemberPage.tsx';
import { ApprovalsPage } from './pages/ApprovalsPage.tsx';
import { RejectionsPage } from './pages/RejectionsPage.tsx';
import { OngoingWorkPage } from './pages/OngoingWorkPage.tsx';
import { CompletedWorkPage } from './pages/CompletedWorkPage.tsx';
import { HighPriorityPage } from './pages/HighPriorityPage.tsx';
import { UserProfilePage } from './pages/UserProfilePage.tsx';
import { AdminWorkflowsAchievementsPage } from './pages/AdminWorkflowsAchievementsPage.tsx';
import { UserGuideModal } from './components/guide/UserGuideModal.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      refetchOnWindowFocus: false,
    },
  },
});

function MainApp() {
  const { user, isLoading, isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [navParams, setNavParams] = useState<any>({});
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleNavigate = (page: string, params: any = {}) => {
    setCurrentPage(page);
    setNavParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 text-slate-800 font-sans relative">
        <div className="fixed inset-0 ambient-liquid-mesh opacity-70 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-base shadow-lg shadow-emerald-700/20">
            N
          </div>
          <span className="text-xs uppercase tracking-wider text-slate-500 font-mono font-semibold">
            Loading Workspace...
          </span>
        </div>
      </div>
    );
  }

  // Unauthenticated -> Login Page
  if (!user) {
    return (
      <>
        <LoginPage onOpenGuide={() => setIsGuideOpen(true)} />
        <UserGuideModal
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
          onNavigate={handleNavigate}
        />
      </>
    );
  }

  // Render Page Content inside Glassy Dashboard Layout
  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return isAdmin ? (
          <AdminDashboard onNavigate={handleNavigate} />
        ) : (
          <EmployeeDashboard onNavigate={handleNavigate} />
        );
      case 'manage-teams':
        return <ManageTeamsPage onNavigate={handleNavigate} />;
      case 'manage-users':
        return <ManageUsersPage onNavigate={handleNavigate} />;
      case 'tasks':
        return <TasksPage onNavigate={handleNavigate} initialFilter={navParams.filter} />;
      case 'task-details':
        return <TaskDetailsPage taskId={navParams.taskId} onNavigate={handleNavigate} />;
      case 'my-team-leader':
        return <MyTeamLeaderPage onNavigate={handleNavigate} />;
      case 'my-team-member':
        return <MyTeamMemberPage onNavigate={handleNavigate} />;
      case 'approvals':
        return <ApprovalsPage onNavigate={handleNavigate} />;
      case 'rejections':
        return <RejectionsPage onNavigate={handleNavigate} />;
      case 'ongoing-work':
        return <OngoingWorkPage onNavigate={handleNavigate} />;
      case 'completed-work':
        return <CompletedWorkPage onNavigate={handleNavigate} />;
      case 'high-priority':
        return <HighPriorityPage onNavigate={handleNavigate} />;
      // Routing for admin workflows & achievements dual view
      case 'admin-workflows-achievements':
      case 'workflows-achievements':
      case 'admin-workflows':
        return (
          <AdminWorkflowsAchievementsPage
            onNavigate={handleNavigate}
            initialViewMode={navParams.viewMode || navParams.view || 'tree'}
          />
        );
      case 'user-profile':
      case 'profile':
        return <UserProfilePage onNavigate={handleNavigate} />;
      default:
        return isAdmin ? (
          <AdminDashboard onNavigate={handleNavigate} />
        ) : (
          <EmployeeDashboard onNavigate={handleNavigate} />
        );
    }
  };

  return (
    <>
      <DashboardLayout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenGuide={() => setIsGuideOpen(true)}
      >
        {renderContent()}
      </DashboardLayout>

      {/* Global Interactive User Guide Modal */}
      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onNavigate={handleNavigate}
      />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </QueryClientProvider>
  );
}
