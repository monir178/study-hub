import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import roomsSlice from "@/features/rooms/store/roomsSlice";

// Create a mock store for testing
export const createMockStore = (initialState: any = {}) => {
  return configureStore({
    reducer: {
      rooms: roomsSlice,
    },
    preloadedState: {
      rooms: {
        selectedRoomId: null,
        showCreateRoomDialog: false,
        showJoinRoomDialog: false,
        showDeleteRoomDialog: false,
        searchQuery: "",
        roleFilter: "all",
        currentTab: "public" as "public" | "my-rooms",
        currentPage: 1,
        itemsPerPage: 12,
        isConnected: false,
        connectionError: null,
        memberCounts: {},
        roomMembers: {},
        ...initialState,
      },
    },
  });
};

// Custom render function that includes Redux Provider
export const renderWithProviders = (
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = createMockStore(preloadedState),
    ...renderOptions
  }: {
    preloadedState?: any;
    store?: ReturnType<typeof createMockStore>;
  } & Omit<RenderOptions, "wrapper"> = {},
) => {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

// Re-export everything from testing-library/react
export * from "@testing-library/react";
