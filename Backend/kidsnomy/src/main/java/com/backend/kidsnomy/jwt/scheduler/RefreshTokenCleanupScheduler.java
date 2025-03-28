// package com.backend.kidsnomy.jwt.scheduler;

// import com.backend.kidsnomy.jwt.repository.UserRefreshTokenRepository;
// import com.backend.kidsnomy.jwt.entity.UserRefreshToken;
// import org.springframework.context.event.EventListener;
// import org.springframework.stereotype.Component;
// import org.springframework.boot.context.event.ApplicationReadyEvent;

// import java.time.LocalDateTime;
// import java.util.List;

// @Component
// public class RefreshTokenCleanupScheduler {

//     private final UserRefreshTokenRepository refreshTokenRepository;

//     public RefreshTokenCleanupScheduler(UserRefreshTokenRepository refreshTokenRepository) {
//         this.refreshTokenRepository = refreshTokenRepository;
//     }

//     // 앱이 완전히 시작된 후 주기적으로 삭제 시작
//     @EventListener(ApplicationReadyEvent.class)
//     public void scheduleCleanupTask() {
//         System.out.println("▶ 리프레시 토큰 정리 스케줄러 초기화됨");

//         Runnable task = () -> {
//             while (true) {
//                 try {
//                     deleteExpiredTokens();
//                     Thread.sleep(1000000_000); // 10초마다 반복
//                 } catch (InterruptedException e) {
//                     System.out.println("스케줄러 중단됨");
//                     break;
//                 }
//             }
//         };

//         Thread schedulerThread = new Thread(task);
//         schedulerThread.setDaemon(true); // 앱 종료 시 같이 종료되도록
//         schedulerThread.start();
//     }

//     public void deleteExpiredTokens() {
//         List<UserRefreshToken> allTokens = refreshTokenRepository.findAll();
//         LocalDateTime now = LocalDateTime.now();

//         allTokens.stream()
//                 .filter(token -> token.getExpiredAt().isBefore(now))
//                 .forEach(token -> {
//                     refreshTokenRepository.delete(token);
//                     System.out.println("삭제됨: " + token.getId());
//                 });
//     }
// }
