import App from "../src/App";
import Lotto from "../src/Lotto.js";
import { MissionUtils } from "@woowacourse/mission-utils";

jest.setTimeout(20000); // 타임아웃을 20초로 설정

describe("로또 클래스 테스트", () => {
    beforeAll(() => {
        // MissionUtils.Console.readLine을 모의로 설정
        jest.spyOn(MissionUtils.Console, 'readLine').mockImplementation((prompt, callback) => {
            if (prompt.includes("구입 금액")) callback("8000");
            if (prompt.includes("당첨 번호")) callback("1,2,3,4,5,6");
            if (prompt.includes("보너스 번호")) callback("7");
        });

        jest.spyOn(MissionUtils.Console, 'print').mockImplementation((output) => {
            // 출력을 단순히 기록하거나 무시합니다.
            console.log(output); // 콘솔에서 출력을 확인할 수 있도록 합니다.
        });

        jest.useFakeTimers(); // 가짜 타이머 사용
    });

    afterAll(() => {
        jest.restoreAllMocks(); // 모든 모의 설정 복구
        jest.useRealTimers(); // 타이머 원래 상태로 복원
    });

    test("로또 번호의 개수가 6개가 넘어가면 예외가 발생한다.", () => {
        expect(() => {
            new Lotto([1, 2, 3, 4, 5, 6, 7]);
        }).toThrow("[ERROR]");
    });

    test("로또 번호에 중복된 숫자가 있으면 예외가 발생한다.", () => {
        expect(() => {
            new Lotto([1, 2, 3, 4, 5, 5]);
        }).toThrow("[ERROR]");
    });

    test("정상적인 로또 게임 진행", async() => {
        const app = new App();
        const runPromise = app.run();

        jest.runAllTimers(); // 모든 타이머 실행
        await runPromise;

        // 추가적인 검증 로직을 여기에 추가할 수 있습니다.
    });
});