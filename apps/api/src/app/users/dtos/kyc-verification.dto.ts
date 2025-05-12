import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsBoolean, IsObject, IsOptional, ValidateIf } from 'class-validator';

export class CompleteKycVerificationDto {
  @ApiProperty({
    description: 'Whether the KYC verification is approved',
    example: true,
    required: true,
  })
  @IsBoolean()
  isApproved: boolean;

  @ApiProperty({
    description: 'Additional details about the KYC verification',
    example: { reason: 'All documents verified successfully', score: 95 },
    required: false,
  })
  @ValidateIf((o) => o.details !== undefined)
  @IsObject()
  @IsOptional()
  details?: Prisma.JsonValue;
}
