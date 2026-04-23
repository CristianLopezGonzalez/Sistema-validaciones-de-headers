import { Request, Response } from 'express';
import { ScanerService } from '../services/scanerService';
import { prisma } from '../config/database'
import { HttpResponse } from '../middlewares/httpResponse';

const http = new HttpResponse();
const scanerService = new ScanerService();
export const createScan = async (req: Request, res: Response) => {
    const { url } = req.body;
    const userId = req.user!.userId;

    const scanResult = await scanerService.scanUrl(url);

    const scan = await prisma.scan.create({
        data: {
            url,
            userId,
            status: 'completed',
            score: scanResult.score,
            totalIssues: scanResult.totalIssues,
            criticalIssues: scanResult.criticalIssues,
            highIssues: scanResult.highIssues,
            mediumIssues: scanResult.mediumIssues,
            lowIssues: scanResult.lowIssues,
            results: scanResult,
            duration: scanResult.duration
        }
    })

    return http.Created(res, { scan });

}

export const getScans = async (req: Request, res: Response) => {

    const userId = req.user!.userId;

    const scans = await prisma.scan.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            url: true,
            status: true,
            score: true,
            totalIssues: true,
            criticalIssues: true,
            highIssues: true,
            mediumIssues: true,
            lowIssues: true,
            duration: true,
            createdAt: true,
        }
    });

    return http.OK(res, { scans, total: scans.length });

}

export const getscanById = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;

    if (userId !== id) {
        return http.Unauthorized(res, { error: 'Unauthorized to access this scan' });
    }

    const scan = await prisma.scan.findUnique({
        where: { id }
    });

    if (!scan) {
        return http.NotFound(res, { error: 'Scan not found' });
    }

    return http.OK(res, { scan });
}

