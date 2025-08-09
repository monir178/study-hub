"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Plus,
  RefreshCw,
  Users,
  Globe,
  AlertCircle,
} from "lucide-react";
import { StudyRoomCard } from "./StudyRoomCard";
import { CreateRoomForm } from "./CreateRoomForm";
import { useRooms, useJoinRoom, useLeaveRoom } from "../hooks/useRooms";
import { useDebounce } from "@/lib/hooks/useDebounce";

interface StudyRoomListProps {
  onRoomSelect?: (roomId: string) => void;
}

export function StudyRoomList({ onRoomSelect }: StudyRoomListProps) {
  const t = useTranslations("rooms");
  const tCommon = useTranslations("common");
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState("public");
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();

  const debouncedSearch = useDebounce(search, 500);

  // Check for create query parameter on mount
  useEffect(() => {
    const createParam = searchParams.get("create");
    if (createParam === "true") {
      setShowCreateForm(true);
    }
  }, [searchParams]);

  const {
    data: roomsData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useRooms({
    page,
    limit: 12,
    search: debouncedSearch,
    myRooms: activeTab === "my-rooms",
  });

  const joinRoom = useJoinRoom();
  const leaveRoom = useLeaveRoom();

  const handleJoinRoom = async (roomId: string) => {
    try {
      await joinRoom.mutateAsync({ roomId, data: {} });
      // Don't call onRoomSelect here since StudyRoomCard will handle navigation
    } catch (error) {
      // Error handled by mutation hook, but re-throw for StudyRoomCard to handle
      throw error;
    }
  };

  const handleLeaveRoom = async (roomId: string) => {
    try {
      await leaveRoom.mutateAsync(roomId);
    } catch (error) {
      // Error handled by mutation hook, but re-throw for StudyRoomCard to handle
      throw error;
    }
  };

  const handleRoomCreated = (roomId: string) => {
    setShowCreateForm(false);
    if (onRoomSelect) {
      onRoomSelect(roomId);
    }
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const rooms = roomsData?.rooms || [];
  const pagination = roomsData?.pagination;
  const hasMore = pagination ? page < pagination.pages : false;

  if (showCreateForm) {
    return (
      <CreateRoomForm
        onSuccess={handleRoomCreated}
        onCancel={() => setShowCreateForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t("createRoom")}
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={t("searchRooms")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isRefetching}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`}
          />
          {tCommon("refresh") || "Refresh"}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="public">
            <Globe className="w-4 h-4 mr-2" />
            {t("publicRooms")}
          </TabsTrigger>
          <TabsTrigger value="my-rooms">
            <Users className="w-4 h-4 mr-2" />
            {t("myRooms")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="public" className="space-y-4">
          {/* Stats */}
          {pagination && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>
                  {pagination.total} {t("publicRoomsCount")}
                </span>
              </div>
              {debouncedSearch && (
                <Badge variant="outline">
                  {t("searchPrefix")} "{debouncedSearch}"
                </Badge>
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="space-y-2">
                      <div className="h-5 bg-muted animate-pulse rounded w-3/4"></div>
                      <div className="h-4 bg-muted animate-pulse rounded w-full"></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
                      <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
                      <div className="h-8 bg-muted animate-pulse rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{t("failedToLoadRooms")}</AlertDescription>
            </Alert>
          )}

          {/* Empty State */}
          {!isLoading && !error && rooms.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Globe className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  {debouncedSearch ? t("noRoomsFound") : t("noPublicRoomsYet")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {debouncedSearch
                    ? t("tryAdjustingSearch")
                    : t("beFirstToCreate")}
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t("createFirstRoomShort")}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Rooms Grid */}
          {!isLoading && !error && rooms.length > 0 && (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rooms.map((room) => (
                  <StudyRoomCard
                    key={room.id}
                    room={room}
                    onJoin={handleJoinRoom}
                    onLeave={handleLeaveRoom}
                    onView={onRoomSelect}
                    loading={joinRoom.isPending || leaveRoom.isPending}
                  />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={isLoading}
                  >
                    {isLoading ? tCommon("loading") : tCommon("loadMore")}
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="my-rooms" className="space-y-4">
          {/* My Rooms Content - Similar structure but filtered for user's rooms */}
          {!isLoading && !error && rooms.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">{t("noRoomsYet")}</h3>
                <p className="text-muted-foreground mb-4">
                  {t("createOrJoinToSee")}
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t("createRoom")}
                </Button>
              </CardContent>
            </Card>
          )}

          {!isLoading && !error && rooms.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <StudyRoomCard
                  key={room.id}
                  room={room}
                  onJoin={handleJoinRoom}
                  onLeave={handleLeaveRoom}
                  onView={onRoomSelect}
                  loading={joinRoom.isPending || leaveRoom.isPending}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
