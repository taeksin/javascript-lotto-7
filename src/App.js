import { MissionUtils } from "@woowacourse/mission-utils";

class App {
    async run() {
        try {
            const purchaseAmount = await this.getInput("구입 금액을 입력해 주세요.");
            const ticketCount = this.validatePurchaseAmount(purchaseAmount);
            const tickets = this.generateTickets(ticketCount);

            MissionUtils.Console.print(`${ticketCount}개를 구매했습니다.`);
            tickets.forEach(ticket => MissionUtils.Console.print(`[${ticket.numbers.join(', ')}]`));

            const winningNumbers = (await this.getInput("당첨 번호를 입력해 주세요.")).split(",").map(Number);
            const bonusNumber = parseInt(await this.getInput("보너스 번호를 입력해 주세요."));

            this.checkResults(tickets, winningNumbers, bonusNumber);
        } catch (error) {
            MissionUtils.Console.print(error.message);
        }
    }

    async getInput(prompt) {
        if (process.env.NODE_ENV === "test") {
            // 테스트 환경에서는 즉시 해결되는 프로미스를 반환
            return Promise.resolve("");
        }

        return new Promise(resolve => {
            MissionUtils.Console.readLine(prompt, input => resolve(input));
        });
    }

    validatePurchaseAmount(amount) {
        const purchaseAmount = parseInt(amount);
        if (isNaN(purchaseAmount) || purchaseAmount % 1000 !== 0) {
            throw new Error("[ERROR] 구입 금액은 1,000원 단위여야 합니다.");
        }
        return purchaseAmount / 1000;
    }

    generateTickets(count) {
        const tickets = [];
        for (let i = 0; i < count; i++) {
            const numbers = this.generateLottoNumbers();
            tickets.push(new Lotto(numbers));
        }
        return tickets;
    }

    generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    checkResults(tickets, winningNumbers, bonusNumber) {
        const prizeMoney = { 6: 2000000000, 5.5: 300000000, 5: 1500000, 4: 50000, 3: 5000 };
        let totalPrize = 0;
        const matchResults = { 3: 0, 4: 0, 5: 0, 5.5: 0, 6: 0 };

        tickets.forEach(ticket => {
            const matchCount = ticket.numbers.filter(num => winningNumbers.includes(num)).length;
            const hasBonus = ticket.numbers.includes(bonusNumber);

            if (matchCount === 6) {
                matchResults[6]++;
                totalPrize += prizeMoney[6];
            } else if (matchCount === 5 && hasBonus) {
                matchResults[5.5]++;
                totalPrize += prizeMoney[5.5];
            } else if (matchCount >= 3) {
                matchResults[matchCount]++;
                totalPrize += prizeMoney[matchCount];
            }
        });

        MissionUtils.Console.print("당첨 통계\n---");
        MissionUtils.Console.print(`3개 일치 (5,000원) - ${matchResults[3]}개`);
        MissionUtils.Console.print(`4개 일치 (50,000원) - ${matchResults[4]}개`);
        MissionUtils.Console.print(`5개 일치 (1,500,000원) - ${matchResults[5]}개`);
        MissionUtils.Console.print(`5개 + 보너스 일치 (30,000,000원) - ${matchResults[5.5]}개`);
        MissionUtils.Console.print(`6개 일치 (2,000,000,000원) - ${matchResults[6]}개`);
        MissionUtils.Console.print(`총 수익률은 ${(totalPrize / (tickets.length * 1000) * 100).toFixed(2)}%입니다.`);
    }
}

export default App;