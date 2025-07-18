import { users, semesters, units, type User, type InsertUser, type Semester, type InsertSemester, type Unit, type InsertUnit } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createSemester(semester: InsertSemester): Promise<Semester>;
  getSemesters(): Promise<Semester[]>;
  
  createUnit(unit: InsertUnit): Promise<Unit>;
  getUnits(): Promise<Unit[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private semesters: Map<number, Semester>;
  private units: Map<number, Unit>;
  private currentUserId: number;
  private currentSemesterId: number;
  private currentUnitId: number;

  constructor() {
    this.users = new Map();
    this.semesters = new Map();
    this.units = new Map();
    this.currentUserId = 1;
    this.currentSemesterId = 1;
    this.currentUnitId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createSemester(insertSemester: InsertSemester): Promise<Semester> {
    const id = this.currentSemesterId++;
    const semester: Semester = { 
      ...insertSemester, 
      id,
      university: insertSemester.university || null,
      syllabus: insertSemester.syllabus || null
    };
    this.semesters.set(id, semester);
    return semester;
  }

  async getSemesters(): Promise<Semester[]> {
    return Array.from(this.semesters.values());
  }

  async createUnit(insertUnit: InsertUnit): Promise<Unit> {
    const id = this.currentUnitId++;
    const unit: Unit = { 
      ...insertUnit, 
      id,
      youtube: insertUnit.youtube || null,
      question: insertUnit.question || null
    };
    this.units.set(id, unit);
    return unit;
  }

  async getUnits(): Promise<Unit[]> {
    return Array.from(this.units.values());
  }
}

export const storage = new MemStorage();
