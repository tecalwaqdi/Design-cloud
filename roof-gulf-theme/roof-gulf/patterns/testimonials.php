<?php
/**
 * Title: آراء العملاء
 * Slug: roof-gulf/testimonials
 * Categories: roof-gulf, testimonials
 */
$rg_t = array(
	array( 'نفّذوا لنا مجمع الفلل بجودة ممتازة وسلّموا قبل الموعد بأسبوعين. فريق محترف ومتعاون.', 'م. خالد العتيبي', 'مطوّر عقاري' ),
	array( 'تعاملنا معهم في تشطيب مقرّنا الرئيسي، والنتيجة فاقت توقعاتنا من حيث الدقة والذوق.', 'أ. سارة القحطاني', 'مديرة مرافق' ),
	array( 'شفافية في الأسعار والتزام بالمواصفات. أنصح بهم لأي مشروع إنشائي.', 'أ. فهد الدوسري', 'مالك عقار' ),
);
?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"},"margin":{"top":"0"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="margin-top:0;padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)"><!-- wp:paragraph {"align":"center","className":"rg-eyebrow"} -->
<p class="has-text-align-center rg-eyebrow">آراء عملائنا</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"textAlign":"center","fontSize":"xx-large"} -->
<h2 class="wp-block-heading has-text-align-center has-xx-large-font-size">ثقة عملائنا هي رأس مالنا</h2>
<!-- /wp:heading -->

<!-- wp:columns {"align":"wide","className":"rg-cards","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|40"},"margin":{"top":"var:preset|spacing|50"}}}} -->
<div class="wp-block-columns alignwide rg-cards" style="margin-top:var(--wp--preset--spacing--50)"><?php foreach ( $rg_t as $rg_q ) : ?><!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"rg-card","style":{"border":{"radius":"16px","width":"1px"},"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|40","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}}},"borderColor":"line","backgroundColor":"base","layout":{"type":"default"}} -->
<div class="wp-block-group rg-card has-border-color has-line-border-color has-base-background-color has-background" style="border-width:1px;border-radius:16px;padding-top:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40)"><!-- wp:paragraph {"style":{"typography":{"letterSpacing":"0.15em"}},"textColor":"accent"} -->
<p class="has-accent-color has-text-color" style="letter-spacing:0.15em">★★★★★</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"typography":{"lineHeight":"1.9"}}} -->
<p style="line-height:1.9">«<?php echo esc_html( $rg_q[0] ); ?>»</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"typography":{"fontWeight":"800"},"spacing":{"margin":{"top":"var:preset|spacing|30","bottom":"0"}}},"textColor":"primary"} -->
<p class="has-primary-color has-text-color" style="margin-top:var(--wp--preset--spacing--30);margin-bottom:0;font-weight:800"><?php echo esc_html( $rg_q[1] ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"0"}}},"textColor":"muted","fontSize":"small"} -->
<p class="has-muted-color has-text-color has-small-font-size" style="margin-top:0"><?php echo esc_html( $rg_q[2] ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column --><?php endforeach; ?></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->
