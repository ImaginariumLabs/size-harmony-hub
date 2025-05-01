import { vi } from 'vitest';

// Create a mock Supabase client
export const createSupabaseMock = () => {
  const authMock = {
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    session: null,
    user: null,
    onAuthStateChange: vi.fn(),
  };

  const fromMock = vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    containedBy: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    overlaps: vi.fn().mockReturnThis(),
    textSearch: vi.fn().mockReturnThis(),
    filter: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),
    then: vi.fn().mockImplementation((callback) => Promise.resolve(callback({ data: [], error: null }))),
  });

  const storageMock = {
    from: vi.fn().mockReturnValue({
      upload: vi.fn(),
      download: vi.fn(),
      getPublicUrl: vi.fn(),
      list: vi.fn(),
      remove: vi.fn(),
    }),
  };

  return {
    auth: authMock,
    from: fromMock,
    storage: storageMock,
  };
};

// Create a mock for the supabaseClient
export const supabaseClientMock = createSupabaseMock();

// Mock the supabaseClient module
vi.mock('../../services/supabaseClient', () => ({
  default: supabaseClientMock,
}));

export default supabaseClientMock;
