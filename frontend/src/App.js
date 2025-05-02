import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/user/Home";
import PostDetail from "./pages/user/PostDetail";
import AboutUs from "./pages/user/AboutUs";
import AllPosts from "./pages/user/AllPosts";
import Contact from "./pages/user/Contact";
import Projects from "./pages/user/Projects";
import ProjectDetail from "./pages/user/ProjectDetail";
import Publications from "./pages/user/Publications";
import Teams from "./pages/user/Teams";
import MemberDetail from "./pages/user/MemberDetail";
import Topbar from "./components/TopBar";
import PageTemplate from "./pages/user/PageTemplate";

import Login from "./pages/login/Login";

import AdminPanel from "./pages/admin/AdminPanel";

import ImageManager from "./pages/admin/ImageManager";
import AboutEdit from "./pages/admin/AboutEdit";
import Messages from "./pages/admin/Messages";
import ReplyMessage from "./pages/admin/ReplayMessage";
import Users from "./pages/admin/Users";
import Register from "./pages/admin/CreateAdmin";
import ProjectList from "./pages/admin/ProjectsList";
import EditProject from "./pages/admin/EditProject";
import AddProject from "./pages/admin/AddProject";
import PublicationsList from "./pages/admin/PublicationList";
import AddPublication from "./pages/admin/AddPublication";
import EditPublication from "./pages/admin/EditPublication";
import TeamsList from "./pages/admin/TeamsList";
import AddTeamMember from "./pages/admin/AddTeamMember";
import EditTeamMember from "./pages/admin/EditTeamMember";
import EditSocialMedia from "./pages/admin/EditSocialMedia";
import PageList from "./pages/admin/PageList";
import BlogList from "./pages/admin/BlogList";
import General from "./pages/admin/General";

import { LanguageProvider } from "./context/LanguageContext";
import "./App.css";

const App = () => (
  <LanguageProvider>
    <Router>
      <div className="app">
        <Topbar />
        <Header title="React Blog Sitesi" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/about-us-" element={<AboutUs />} />
          <Route path="/blogs" element={<AllPosts />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/all-projects" element={<Projects />} />
          <Route path="/projects/project-detail/:id" element={<ProjectDetail />} />
          <Route path="/all-publications" element={<Publications />} />
          <Route path="/all-teams" element={<Teams />} />
          <Route path="/teams/member/:id" element={<MemberDetail />} />
          <Route path="/:slug" element={<PageTemplate />} />

          <Route path="/login" element={<Login />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/users/add-user" element={<Register />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/image-manager" element={<ImageManager />} />
          <Route path="/admin/about-edit" element={<AboutEdit />} />
          <Route path="/admin/messages" element={<Messages />} />
          <Route path="/admin/reply-message/:id" element={<ReplyMessage />} />
          <Route path="/admin/project-list" element={<ProjectList />} />
          <Route path="/admin/project-list/edit-project/:id" element={<EditProject />} />
          <Route path="/admin/add-project" element={<AddProject />} />
          <Route path="/admin/publications-list" element={<PublicationsList />} />
          <Route path="/admin/add-publication" element={<AddPublication />} />
          <Route path="/admin/publications-list/edit-publication/:id" element={<EditPublication />} />
          <Route path="/admin/teams-list" element={<TeamsList />} />
          <Route path="/admin/add-team-member" element={<AddTeamMember />} />
          <Route path="/admin/teams-list/edit-team-member/:id" element={<EditTeamMember />} />
          <Route path="/admin/social-media" element={<EditSocialMedia />} />
          <Route path="/admin/page-list" element={<PageList />} />
          <Route path="/admin/blog-list" element={<BlogList />} />
          <Route path="/admin/general" element={<General />} />



        </Routes>
        <Footer />
      </div>
    </Router>
  </LanguageProvider>
);

export default App;