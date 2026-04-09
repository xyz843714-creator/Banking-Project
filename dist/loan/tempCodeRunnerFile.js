"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (startDate && endDate) {
    query.andWhere('loan.createdAt BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
    });
}
if (loanId) {
    query.andWhere('loan.id = :loanId', { loanId });
}
if (status) {
    query.andWhere('loan.status = :status', { status });
}
if (name) {
    query.andWhere('user.name ILIKE :name', { name: `%${name}$%` });
}
if (mobileNumber) {
    query.andWhere('user.mobileNumber = :mobileNumber', { mobileNumber });
}
if (emiId) {
    query.andWhere('loan.id IN (SELECT "loanId" FROM "emi_payment" WHERE id = :emiId)', { emiId });
}
if (emiDueDate) {
    query.andWhere('loan.id IN (SELECT "loanId" FROM "emi_payment" WHERE DATE("dueDate") = :emiDueDate)', { emiDueDate });
}
const totalLoans = await query.getCount();
const totalPages = Math.ceil(totalLoans / parsedLimit);
query.skip(skip).take(parsedLimit);
const loans = await query.getRawMany();
if (!loans || loans.length === 0) {
    throw new HttpException('No loans found', HttpStatus.NOT_FOUND);
}
const loanWithEmis = await Promise.all(loans.map(async (loan) => {
    const emis = await this.emiRepo.find({
        where: { loanId: loan.loanId },
        order: { emiNumber: 'ASC' },
    });
    const emiDetails = emis.map((emi) => ({
        emiId: emi.id,
        emiNumber: emi.emiNumber,
        emiAmount: this.formatCurrency(emi.emiAmount),
        penaltyAmount: this.formatCurrency(emi.penaltyAmount),
        totalPaid: this.formatCurrency(emi.totalPaid),
        dueDate: this.formatDate(emi.dueDate),
        paidDate: this.formatDate(emi.paidDate),
        status: emi.status,
    }));
    return {
        loanId: loan.loanId,
        userId: loan.userId,
        userName: loan.userName,
        mobileNumber: loan.mobileNumber,
        loanStatus: loan.loanStatus,
        requestedAmount: this.formatCurrency(loan.requestedAmount),
        approvedAmount: this.formatCurrency(loan.approvedAmount),
        salary: this.formatCurrency(loan.salary),
        interestRate: loan.interestRate,
        emiCount: loan.emiCount,
        emiAmount: this.formatCurrency(loan.emiAmount),
        totalRepayment: this.formatCurrency(loan.totalRepayment),
        loanCreatedAt: this.formatDate(loan.loanCreatedAt),
        emiDetails: {
            totalEmis: loan.emiCount,
            paidEmis: emiDetails.filter(e => e.status === 'paid' || e.status === 'delayed').length,
            pendingEmis: emiDetails.filter(e => e.status === 'pending').length,
            emis: emiDetails,
        },
    };
}));
return {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Loan report fetched successfully',
    data: {
        totalLoans,
        totalPages,
        currentPage: parsedPage,
        limit: parsedLimit,
        loans: loanWithEmis,
    },
};
//# sourceMappingURL=tempCodeRunnerFile.js.map