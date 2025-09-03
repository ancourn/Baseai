'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare, Image as ImageIcon, Search, Sparkles, History, Download, Star, Trash2, BarChart3, User } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useUser } from '@/contexts/user-context';

export default function Home() {
  const { user, setUser, isLoading: userLoading } = useUser();
  const [chatInput, setChatInput] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [chatResponse, setChatResponse] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showHistory, setShowHistory] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);

  // Initialize or get user
  useEffect(() => {
    if (!userLoading && !user) {
      // Create a simple user for demo purposes
      const demoUser = {
        id: 'demo-user-' + Date.now(),
        email: 'demo@baseai.com',
        name: 'Demo User'
      };
      setUser(demoUser);
    }
  }, [user, userLoading, setUser]);

  // Load chat history
  useEffect(() => {
    if (user) {
      loadChatHistory();
      loadGeneratedImages();
      loadSearchHistory();
      loadFavorites();
    }
  }, [user]);

  const loadChatHistory = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/chat-history?userId=${user.id}`);
      const data = await response.json();
      setChatHistory(data.chatHistory || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const loadGeneratedImages = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/generated-images?userId=${user.id}`);
      const data = await response.json();
      setGeneratedImages(data.images || []);
    } catch (error) {
      console.error('Error loading generated images:', error);
    }
  };

  const loadSearchHistory = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/search-history?userId=${user.id}`);
      const data = await response.json();
      setSearchHistory(data.searchHistory || []);
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem('baseai_favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  };

  const saveChatMessage = async (message: string, response: string) => {
    if (!user) return;
    
    try {
      await fetch('/api/chat-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, response, userId: user.id })
      });
      loadChatHistory(); // Refresh history
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  };

  const saveGeneratedImage = async (prompt: string, imageData: string) => {
    if (!user) return;
    
    try {
      await fetch('/api/generated-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, imageData, userId: user.id })
      });
      loadGeneratedImages(); // Refresh gallery
    } catch (error) {
      console.error('Error saving generated image:', error);
    }
  };

  const downloadImage = (imageData: string, filename: string) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${imageData}`;
    link.download = filename;
    link.click();
  };

  const saveSearchHistory = async (query: string, results: any[]) => {
    if (!user) return;
    
    try {
      await fetch('/api/search-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, results, userId: user.id })
      });
      loadSearchHistory(); // Refresh search history
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const toggleFavorite = (searchId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(searchId)) {
      newFavorites.delete(searchId);
    } else {
      newFavorites.add(searchId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('baseai_favorites', JSON.stringify(Array.from(newFavorites)));
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    
    setIsChatLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatInput })
      });
      const data = await response.json();
      setChatResponse(data.response);
      
      // Save to chat history
      if (user) {
        await saveChatMessage(chatInput, data.response);
      }
    } catch (error) {
      setChatResponse('Error: Failed to get response');
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleImageGeneration = async () => {
    if (!imagePrompt.trim()) return;
    
    setIsImageLoading(true);
    try {
      const response = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt })
      });
      const data = await response.json();
      setGeneratedImage(data.image);
      
      // Save to gallery
      if (user && data.image) {
        await saveGeneratedImage(imagePrompt, data.image);
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearchLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await response.json();
      setSearchResults(data.results || []);
      
      // Save to search history
      if (user && data.results) {
        await saveSearchHistory(searchQuery, data.results);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsSearchLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Sparkles className="h-12 w-12 text-primary mr-3" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Baseai
              </h1>
            </div>
            <ThemeToggle />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your intelligent AI companion for chat, image generation, and web search
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge variant="secondary">AI Chat</Badge>
            <Badge variant="secondary">Image Generation</Badge>
            <Badge variant="secondary">Web Search</Badge>
          </div>
        </div>

        {/* Main Features */}
        <Tabs defaultValue="chat" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Generate Image
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Web Search
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>AI Chat Assistant</CardTitle>
                        <CardDescription>
                          Ask anything and get intelligent responses from our AI
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowHistory(!showHistory)}
                        className="lg:hidden"
                      >
                        <History className="h-4 w-4 mr-2" />
                        History
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Type your message here..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button 
                        onClick={handleChat} 
                        disabled={isChatLoading || !chatInput.trim()}
                        className="self-end"
                      >
                        {isChatLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Send'
                        )}
                      </Button>
                    </div>
                    {chatResponse && (
                      <Card>
                        <CardContent className="pt-6">
                          <p className="whitespace-pre-wrap">{chatResponse}</p>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Chat History */}
              <div className={`${showHistory ? 'block' : 'hidden'} lg:block`}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Chat History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {chatHistory.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No chat history yet
                        </p>
                      ) : (
                        chatHistory.map((chat, index) => (
                          <Card key={chat.id} className="p-3">
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="font-medium">You:</span>
                                <p className="text-muted-foreground mt-1">{chat.message}</p>
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">AI:</span>
                                <p className="text-muted-foreground mt-1 line-clamp-3">
                                  {chat.response}
                                </p>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(chat.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Image Generation Tab */}
          <TabsContent value="image">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Image Generation Interface */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>AI Image Generator</CardTitle>
                        <CardDescription>
                          Create stunning images from text descriptions
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowGallery(!showGallery)}
                        className="lg:hidden"
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Gallery
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Describe the image you want to generate..."
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleImageGeneration} 
                        disabled={isImageLoading || !imagePrompt.trim()}
                      >
                        {isImageLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Generate'
                        )}
                      </Button>
                    </div>
                    {generatedImage && (
                      <div className="mt-4 space-y-3">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="space-y-3">
                              <img 
                                src={`data:image/png;base64,${generatedImage}`} 
                                alt="Generated" 
                                className="max-w-full h-auto rounded-lg border"
                              />
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-muted-foreground">
                                  Prompt: {imagePrompt}
                                </p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadImage(generatedImage, `generated-${Date.now()}.png`)}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Image Gallery */}
              <div className={`${showGallery ? 'block' : 'hidden'} lg:block`}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Image Gallery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {generatedImages.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No generated images yet
                        </p>
                      ) : (
                        generatedImages.map((image, index) => (
                          <Card key={image.id} className="p-3">
                            <div className="space-y-2">
                              <img 
                                src={`data:image/png;base64,${image.imageData}`} 
                                alt={image.prompt}
                                className="w-full h-auto rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => downloadImage(image.imageData, `gallery-${image.id}.png`)}
                              />
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {image.prompt}
                              </p>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(image.createdAt).toLocaleDateString()}
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => downloadImage(image.imageData, `gallery-${image.id}.png`)}
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Web Search Tab */}
          <TabsContent value="search">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Search Interface */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Web Search</CardTitle>
                        <CardDescription>
                          Search the web and get relevant results
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSearchHistory(!showSearchHistory)}
                        className="lg:hidden"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        History
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="What do you want to search for?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleSearch} 
                        disabled={isSearchLoading || !searchQuery.trim()}
                      >
                        {isSearchLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Search'
                        )}
                      </Button>
                    </div>
                    {searchResults.length > 0 && (
                      <div className="space-y-3 mt-4">
                        {searchResults.map((result, index) => (
                          <Card key={index}>
                            <CardContent className="pt-4">
                              <h3 className="font-semibold text-lg mb-2">
                                <a 
                                  href={result.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {result.name}
                                </a>
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {result.host_name}
                              </p>
                              <p className="text-sm">{result.snippet}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Search History */}
              <div className={`${showSearchHistory ? 'block' : 'hidden'} lg:block`}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Search History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {searchHistory.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No search history yet
                        </p>
                      ) : (
                        searchHistory.map((search) => {
                          const results = JSON.parse(search.results);
                          const isFavorite = favorites.has(search.id);
                          
                          return (
                            <Card key={search.id} className="p-3">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-sm line-clamp-1">
                                    {search.query}
                                  </h4>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => toggleFavorite(search.id)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Star 
                                        className={`h-3 w-3 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`}
                                      />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setSearchQuery(search.query);
                                        handleSearch();
                                      }}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Search className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {results.length} results • {new Date(search.createdAt).toLocaleString()}
                                </div>
                                {isFavorite && (
                                  <Badge variant="secondary" className="text-xs">
                                    Favorite
                                  </Badge>
                                )}
                              </div>
                            </Card>
                          );
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="space-y-6">
              {/* User Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    User Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{user?.name || 'Demo User'}</h3>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Chat Messages</p>
                        <p className="text-2xl font-bold">{chatHistory.length}</p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Images Generated</p>
                        <p className="text-2xl font-bold">{generatedImages.length}</p>
                      </div>
                      <ImageIcon className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Web Searches</p>
                        <p className="text-2xl font-bold">{searchHistory.length}</p>
                      </div>
                      <Search className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Favorites</p>
                        <p className="text-2xl font-bold">{favorites.size}</p>
                      </div>
                      <Star className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Chats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Chats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {chatHistory.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No chat history yet
                        </p>
                      ) : (
                        chatHistory.slice(0, 5).map((chat) => (
                          <div key={chat.id} className="p-3 border rounded-lg">
                            <p className="text-sm font-medium line-clamp-1">
                              {chat.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(chat.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Favorite Searches */}
                <Card>
                  <CardHeader>
                    <CardTitle>Favorite Searches</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {Array.from(favorites).length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No favorite searches yet
                        </p>
                      ) : (
                        searchHistory
                          .filter(search => favorites.has(search.id))
                          .slice(0, 5)
                          .map((search) => (
                            <div key={search.id} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium line-clamp-1">
                                  {search.query}
                                </p>
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(search.createdAt).toLocaleString()}
                              </p>
                            </div>
                          ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Usage Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Activity Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-500">{chatHistory.length}</div>
                        <div className="text-sm text-muted-foreground">Chats</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-500">{generatedImages.length}</div>
                        <div className="text-sm text-muted-foreground">Images</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-500">{searchHistory.length}</div>
                        <div className="text-sm text-muted-foreground">Searches</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, ((chatHistory.length + generatedImages.length + searchHistory.length) / 50) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Total Activity: {chatHistory.length + generatedImages.length + searchHistory.length} items
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}