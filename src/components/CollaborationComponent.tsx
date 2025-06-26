import React, { useEffect, useState } from 'react';
import { geminiApi } from '../services/geminiApi';
import { CollaborationWorkspace, Task } from '../types/api';

const CollaborationComponent: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<CollaborationWorkspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<CollaborationWorkspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeCollaboration = async () => {
      try {
        setLoading(true);

        // Generate collaboration insights
        const insights = await geminiApi.generateCollaborationInsights({
          topic: 'Geopolitical Risk Analysis',
          participants: ['Analyst 1', 'Analyst 2', 'Policy Expert'],
          context: 'Multi-user geopolitical analysis workspace',
          objectives: ['Risk assessment', 'Scenario planning', 'Policy recommendations']
        });

        if (!insights.success || !insights.data) {
          throw new Error(insights.error || 'Failed to generate collaboration insights');
        }

        // Create mock workspaces
        const mockWorkspaces: CollaborationWorkspace[] = [
          {
            id: 'workspace-1',
            name: 'Global Risk Assessment',
            description: 'Collaborative analysis of global geopolitical risks',
            type: 'analysis',
            participants: [
              {
                userId: 'user-1',
                role: 'owner',
                permissions: ['read', 'write', 'admin'],
                joinedAt: new Date().toISOString(),
                lastActive: new Date().toISOString()
              },
              {
                userId: 'user-2',
                role: 'analyst',
                permissions: ['read', 'write'],
                joinedAt: new Date().toISOString(),
                lastActive: new Date().toISOString()
              }
            ],
            documents: [
              {
                id: 'doc-1',
                title: 'Risk Assessment Report',
                type: 'analysis',
                content: 'Comprehensive risk analysis document...',
                version: 1,
                authorId: 'user-1',
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                tags: ['risk', 'analysis'],
                attachments: []
              }
            ],
            discussions: [
              {
                id: 'discussion-1',
                title: 'Risk Mitigation Strategies',
                category: 'analysis',
                messages: [
                  {
                    id: 'msg-1',
                    content: 'What are the key risk mitigation strategies we should consider?',
                    authorId: 'user-1',
                    timestamp: new Date().toISOString(),
                    reactions: [],
                    replies: []
                  }
                ],
                participants: ['user-1', 'user-2'],
                status: 'open',
                createdBy: 'user-1',
                createdAt: new Date().toISOString(),
                lastMessage: new Date().toISOString()
              }
            ],
            tasks: insights.data.actionItems.map((item, index) => ({
              id: `task-${index}`,
              title: item.task,
              description: item.task,
              assigneeId: item.assignee,
              status: 'pending',
              priority: item.priority.toLowerCase() as Task['priority'],
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
              createdBy: 'user-1',
              createdAt: new Date().toISOString(),
              dependencies: [],
              tags: []
            })),
            status: 'active',
            createdBy: 'user-1',
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString()
          }
        ];

        setWorkspaces(mockWorkspaces);
        setSelectedWorkspace(mockWorkspaces[0]);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    initializeCollaboration();
  }, []);

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return '#ff4444';
      case 'high': return '#ff8800';
      case 'medium': return '#ffcc00';
      case 'low': return '#44aa44';
      default: return '#888888';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return '#44aa44';
      case 'in_progress': return '#ff8800';
      case 'review': return '#4488ff';
      case 'pending': return '#888888';
      case 'cancelled': return '#ff4444';
      default: return '#888888';
    }
  };

  if (loading) return <div className="p-6">Loading Collaboration...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Collaboration</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Workspace List */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Workspaces</h2>
          <div className="space-y-2">
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                className={`p-3 border rounded cursor-pointer ${
                  selectedWorkspace?.id === workspace.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onClick={() => setSelectedWorkspace(workspace)}
              >
                <h3 className="font-medium">{workspace.name}</h3>
                <p className="text-sm text-gray-600">{workspace.description}</p>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <span>{workspace.participants.length} members</span>
                  <span className="ml-2">{workspace.documents.length} docs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedWorkspace ? (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">{selectedWorkspace.name}</h2>
                <p className="text-gray-600">{selectedWorkspace.description}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <span>Created by {selectedWorkspace.createdBy}</span>
                  <span className="ml-4">Last activity: {new Date(selectedWorkspace.lastActivity).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b mb-6">
                <div className="flex space-x-8">
                  <button className="pb-2 border-b-2 border-blue-500 text-blue-600">Overview</button>
                  <button className="pb-2 text-gray-600">Documents</button>
                  <button className="pb-2 text-gray-600">Discussions</button>
                  <button className="pb-2 text-gray-600">Tasks</button>
                  <button className="pb-2 text-gray-600">Members</button>
                </div>
              </div>

              {/* Overview Tab Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tasks */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Active Tasks ({selectedWorkspace.tasks.length})</h3>
                  <div className="space-y-3">
                    {selectedWorkspace.tasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="border rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{task.title}</h4>
                          <div className="flex items-center space-x-2">
                            <span
                              className="px-2 py-1 rounded text-xs text-white"
                              style={{ backgroundColor: getPriorityColor(task.priority) }}
                            >
                              {task.priority}
                            </span>
                            <span
                              className="px-2 py-1 rounded text-xs text-white"
                              style={{ backgroundColor: getStatusColor(task.status) }}
                            >
                              {task.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Assigned to: {task.assigneeId}</span>
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Discussions */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Recent Discussions ({selectedWorkspace.discussions.length})</h3>
                  <div className="space-y-3">
                    {selectedWorkspace.discussions.map((discussion) => (
                      <div key={discussion.id} className="border rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{discussion.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs ${
                            discussion.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {discussion.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {discussion.messages.length} messages • {discussion.participants.length} participants
                        </p>
                        <p className="text-xs text-gray-500">
                          Last message: {new Date(discussion.lastMessage).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Recent Documents ({selectedWorkspace.documents.length})</h3>
                  <div className="space-y-3">
                    {selectedWorkspace.documents.map((document) => (
                      <div key={document.id} className="border rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{document.title}</h4>
                          <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                            v{document.version}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>By: {document.authorId}</span>
                          <span>Modified: {new Date(document.lastModified).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-2">
                          {document.tags.map((tag, index) => (
                            <span key={index} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-1">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Team Members ({selectedWorkspace.participants.length})</h3>
                  <div className="space-y-3">
                    {selectedWorkspace.participants.map((participant) => (
                      <div key={participant.userId} className="border rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{participant.userId}</h4>
                          <span className={`px-2 py-1 rounded text-xs ${
                            participant.role === 'owner' ? 'bg-purple-100 text-purple-800' :
                            participant.role === 'admin' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {participant.role}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <p>Joined: {new Date(participant.joinedAt).toLocaleDateString()}</p>
                          <p>Last active: {new Date(participant.lastActive).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Select a workspace to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaborationComponent;
