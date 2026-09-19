import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { TutorProfile } from '../../../types';
import { 
  UserCheck, 
  BookOpen, 
  Check, 
  PlusCircle, 
  ShieldCheck, 
  Lock, 
  RotateCcw, 
  Search, 
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Users
} from '../../RealIcons';

export const AdminTutorAssignmentsTab: React.FC = () => {
  const { 
    tutors, 
    tutor: currentActiveTutor, 
    switchActiveTutor, 
    assignSubjectsToTutor, 
    subjects,
    classes,
    setActiveSection
  } = useSchool();

  const [selectedTutorId, setSelectedTutorId] = useState<string>(currentActiveTutor.id || tutors[0]?.id || 'tutor-1');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const activeTutor = tutors.find(t => t.id === selectedTutorId) || tutors[0] || currentActiveTutor;

  const handleToggleSubject = (subjectName: string) => {
    const currentList = activeTutor.assignedSubjects || [];
    const exists = currentList.some(s => s.toLowerCase() === subjectName.toLowerCase());
    const nextList = exists
      ? currentList.filter(s => s.toLowerCase() !== subjectName.toLowerCase())
      : [...currentList, subjectName];

    assignSubjectsToTutor(activeTutor.id, nextList);
    setStatusMessage(`Updated assigned subjects for ${activeTutor.name}.`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleSelectAllSubjects = () => {
    const allSubjectNames = subjects.map(s => s.name);
    assignSubjectsToTutor(activeTutor.id, allSubjectNames);
    setStatusMessage(`Assigned all ${allSubjectNames.length} subjects to ${activeTutor.name}.`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleClearAllSubjects = () => {
    assignSubjectsToTutor(activeTutor.id, []);
    setStatusMessage(`Cleared all subject assignments for ${activeTutor.name}.`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleSwitchAndGoToTutorPortal = (tutorObj: TutorProfile) => {
    switchActiveTutor(tutorObj.id);
    setActiveSection('tutor-portal');
  };

  const filteredTutors = tutors.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.staffId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-black uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" />
              <span>Tutor Subject Access & Scoring Permissions</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Tutor Subject Assignments & Security Clearance
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Assign tutors to specific academic subjects. In the Tutor Portal, tutors are strictly restricted to scoring, uploading continuous assessment results, and creating assignments only for their assigned subjects.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Currently Logged-in Tutor:</span>
            <span className="px-3 py-1 rounded-xl bg-blue-100 text-blue-900 text-xs font-black">
              {currentActiveTutor.name} ({currentActiveTutor.assignedSubjects?.length || 0} subjects)
            </span>
          </div>
        </div>

        {statusMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Tutor List on Left, Subject Checkbox Matrix on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Tutor Roster */}
        <div className="lg:col-span-5 bg-white rounded-3xl shadow-sm border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-900" />
              <span>Faculty Tutors ({tutors.length})</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-semibold">Select to configure</span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tutor by name, ID, dept..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
            />
          </div>

          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredTutors.map(t => {
              const isSelected = t.id === activeTutor.id;
              const isCurrentSession = t.id === currentActiveTutor.id;

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTutorId(t.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-600 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-xs truncate">{t.name}</span>
                      {isCurrentSession && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-800">
                          Active Desk
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      ID: <span className="font-mono text-slate-700">{t.staffId}</span> • {t.department}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {t.assignedSubjects && t.assignedSubjects.length > 0 ? (
                        t.assignedSubjects.slice(0, 3).map(sub => (
                          <span key={sub} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-900">
                            {sub}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> No subjects assigned
                        </span>
                      )}
                      {(t.assignedSubjects?.length || 0) > 3 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                          +{t.assignedSubjects.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSwitchAndGoToTutorPortal(t);
                      }}
                      className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-[10px] font-bold flex items-center gap-1 transition-colors"
                      title="Switch to this tutor and open Tutor Portal"
                    >
                      <span>Open Desk</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Tutor Permission Matrix */}
        <div className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">
                Active Assignment Workspace
              </span>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>{activeTutor.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono font-normal">
                  {activeTutor.staffId}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Department: <strong>{activeTutor.department}</strong> • Current Clearance:{' '}
                <strong className="text-indigo-900">{activeTutor.assignedSubjects?.length || 0} Subject(s)</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectAllSubjects}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Select All
              </button>
              <button
                onClick={handleClearAllSubjects}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Explanation Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Enforced Subject Boundary Rule:</strong> When this tutor logs in at the Tutor Portal, they will <em>only</em> be able to score CA1, CA2, Exam results, and publish homework for the subjects checked below.
            </div>
          </div>

          {/* Subjects Checklist */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
              <span>Assign Authorized Subjects:</span>
              <span className="text-[11px] font-normal text-slate-500">
                Click any subject card to toggle permission
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subjects.map(s => {
                const isAssigned = (activeTutor.assignedSubjects || []).some(
                  subj => subj.toLowerCase() === s.name.toLowerCase()
                );

                return (
                  <div
                    key={s.id}
                    onClick={() => handleToggleSubject(s.name)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                      isAssigned
                        ? 'bg-blue-50 border-blue-600 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 opacity-75'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-black px-1.5 py-0.5 rounded bg-white text-blue-900 border border-slate-200">
                          {s.code}
                        </span>
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {s.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {s.department}
                      </span>
                    </div>

                    <div className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                      isAssigned
                        ? 'bg-blue-900 text-amber-400 border-blue-900'
                        : 'border-slate-300 bg-white text-transparent'
                    }`}>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Open Faculty Desk button */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Assigned <strong>{activeTutor.assignedSubjects?.length || 0}</strong> of <strong>{subjects.length}</strong> total subjects
            </div>

            <button
              onClick={() => handleSwitchAndGoToTutorPortal(activeTutor)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-amber-400" />
              <span>Launch Faculty Gradebook Desk</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
