<?php
/**
 * Title: لماذا تختارنا
 * Slug: roof-gulf/why-us
 * Categories: roof-gulf
 */
$rg_items = array(
	array( '01', 'جودة بلا تنازل', 'نطبّق أنظمة رقابة جودة صارمة في كل مرحلة، ونستخدم مواد معتمدة فقط.' ),
	array( '02', 'التسليم في الموعد', 'جداول زمنية واضحة ومتابعة يومية لضمان تسليم مشروعك في الوقت المحدد.' ),
	array( '03', 'أسعار شفافة', 'عروض أسعار مفصّلة بدون تكاليف خفية، والتزام تام بالميزانية المتفق عليها.' ),
	array( '04', 'السلامة أولاً', 'نلتزم بأعلى معايير الأمن والسلامة المهنية لحماية فريقنا وعملائنا.' ),
);
?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"},"margin":{"top":"0"}}},"backgroundColor":"surface","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-surface-background-color has-background" style="margin-top:0;padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)"><!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|60"}}}} -->
<div class="wp-block-columns alignwide"><!-- wp:column {"width":"36%"} -->
<div class="wp-block-column" style="flex-basis:36%"><!-- wp:paragraph {"className":"rg-eyebrow"} -->
<p class="rg-eyebrow">لماذا سقف الخليج؟</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"fontSize":"xx-large"} -->
<h2 class="wp-block-heading has-xx-large-font-size">نلتزم بما نعد به</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"muted"} -->
<p class="has-muted-color has-text-color">عملاؤنا يختاروننا لأننا نعاملهم كشركاء: تواصل مستمر، تقارير دورية عن سير العمل، وفريق يتحمّل المسؤولية كاملة حتى التسليم.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><?php foreach ( array_chunk( $rg_items, 2 ) as $rg_row ) : ?><!-- wp:columns {"className":"rg-cards","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|40"},"margin":{"bottom":"var:preset|spacing|40"}}}} -->
<div class="wp-block-columns rg-cards" style="margin-bottom:var(--wp--preset--spacing--40)"><?php foreach ( $rg_row as $rg_it ) : ?><!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"rg-card","style":{"border":{"radius":"16px"},"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}}},"backgroundColor":"base","layout":{"type":"default"}} -->
<div class="wp-block-group rg-card has-base-background-color has-background" style="border-radius:16px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40)"><!-- wp:paragraph {"style":{"typography":{"fontSize":"2rem","fontWeight":"800","lineHeight":"1"}},"textColor":"accent"} -->
<p class="has-accent-color has-text-color" style="font-size:2rem;font-weight:800;line-height:1"><?php echo esc_html( $rg_it[0] ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><?php echo esc_html( $rg_it[1] ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"muted"} -->
<p class="has-muted-color has-text-color"><?php echo esc_html( $rg_it[2] ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column --><?php endforeach; ?></div>
<!-- /wp:columns --><?php endforeach; ?></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->
