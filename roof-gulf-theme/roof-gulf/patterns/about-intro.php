<?php
/**
 * Title: نبذة عن الشركة
 * Slug: roof-gulf/about-intro
 * Categories: roof-gulf, about
 */
$rg_img = esc_url( get_theme_file_uri( 'assets/images/about.svg' ) );
?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"},"margin":{"top":"0"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="margin-top:0;padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)"><!-- wp:columns {"verticalAlignment":"center","align":"wide","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|60"}}}} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center"><!-- wp:column {"verticalAlignment":"center","width":"55%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:55%"><!-- wp:paragraph {"className":"rg-eyebrow"} -->
<p class="rg-eyebrow">من نحن</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"fontSize":"xx-large"} -->
<h2 class="wp-block-heading has-xx-large-font-size">خبرة تمتد لأكثر من 15 عاماً في عالم المقاولات</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"muted"} -->
<p class="has-muted-color has-text-color">تأسست سقف الخليج للمقاولات لتقدّم خدمات مقاولات متكاملة بمعايير عالمية. نؤمن بأن كل مشروع هو شراكة طويلة المدى، لذلك نعمل بشفافية كاملة ونلتزم بأعلى معايير الجودة والسلامة في كل مرحلة من مراحل التنفيذ.</p>
<!-- /wp:paragraph -->

<!-- wp:list {"className":"rg-checklist"} -->
<ul class="wp-block-list rg-checklist"><!-- wp:list-item -->
<li>فريق هندسي معتمد وذو خبرة طويلة</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>التزام تام بالجدول الزمني والميزانية</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>مواد بناء عالية الجودة من موردين موثوقين</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>ضمان على الأعمال ومتابعة بعد التسليم</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/about/' ) ); ?>">اعرف المزيد عنا</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center","width":"45%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:45%"><!-- wp:image {"sizeSlug":"full","linkDestination":"none","style":{"border":{"radius":"18px"},"shadow":"var:preset|shadow|card"}} -->
<figure class="wp-block-image size-full has-custom-border"><img src="<?php echo $rg_img; ?>" alt="فريق سقف الخليج في موقع العمل" style="border-radius:18px;box-shadow:var(--wp--preset--shadow--card);aspect-ratio:9/10;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->
