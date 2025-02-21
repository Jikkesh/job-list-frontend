import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { lastValueFrom } from 'rxjs';
import { JobListService } from './job-list.service';

export interface JobImage {
  jobId: number;
  imageData: string; // base64 string
}

@Injectable({ providedIn: 'root' })
export class JobImageCacheService extends Dexie {
  jobImages!: Dexie.Table<JobImage, number>;

  constructor(private joblistService: JobListService) {
    super('SessionImageCache'); // Database name
    this.version(1).stores({
      jobImages: 'jobId,imageData', // Primary key: jobId
    });

    this.jobImages = this.table('jobImages');

    // Clear the database on page unload (ephemeral session)
    window.addEventListener('beforeunload', () => {
      this.clearCache();
    });
  }

  /**
   * Returns a Base64 string for the given jobId.
   * 1. Checks Dexie for a cached image.
   * 2. If not found, fetches from API, converts to Base64, and caches it.
   */
  public async getImage(jobId: any): Promise<string> {
    // 1. Check if image is cached
    const cached = await this.jobImages.get(jobId);
    console.log('Cache: ', cached);
    if (cached) {
      console.log('Cache hit for jobId:', jobId);
      return cached.imageData;
    }

    // 2. Otherwise, fetch from API
    const blob = await lastValueFrom(this.joblistService.getJobImage(jobId));
    // Convert to Base64
    const base64Data = await this.blobToBase64(blob);

    // 3. Store in Dexie
    await this.jobImages.put({ jobId, imageData: base64Data });
    return base64Data;
  }

  /**
   * Converts a Blob to Base64
   */
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Clears the entire cache on page unload (ephemeral session).
   */
  private async clearCache(): Promise<void> {
    await this.jobImages.clear();
  }
}
