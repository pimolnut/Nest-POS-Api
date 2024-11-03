import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './entities/branch/branch.entity';
import { CreateBranchDto } from './dto/create-branch/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch/update-branch.dto';
import { Owner } from '../owner/entities/owner/owner.entity';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,

    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,
  ) {}

  async create(createBranchDto: CreateBranchDto): Promise<Branch> {
    const { owner_id, ...branchData } = createBranchDto;

    // ตรวจสอบว่า owner_id มีอยู่ในฐานข้อมูล
    const owner = await this.ownerRepository.findOne({ where: { owner_id } });
    if (!owner) {
      throw new NotFoundException(`Owner with ID ${owner_id} not found`);
    }

    // สร้าง Branch ใหม่พร้อม map owner
    const newBranch = this.branchRepository.create({
      ...branchData,
      owner,  // map owner ให้กับ Branch
    });

    return this.branchRepository.save(newBranch);
  }

  async findAll(): Promise<Branch[]> {
    return this.branchRepository.find();
  }

  async findOne(id: number): Promise<Branch> {
    const branch = await this.branchRepository.findOne({
      where: { branch_id: id },
    });
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }
    return branch;
  }

  async update(id: number, updateBranchDto: UpdateBranchDto): Promise<Branch> {
    const branch = await this.findOne(id);
    Object.assign(branch, updateBranchDto);
    return this.branchRepository.save(branch);
  }

  async remove(id: number): Promise<void> {
    const branch = await this.findOne(id);
    await this.branchRepository.remove(branch);
  }
}
