<?php
/**
 * Title: خدماتنا (بطاقات)
 * Slug: roof-gulf/services
 * Categories: roof-gulf, services
 */
$rg_services = array(
	array( 'building', 'الإنشاءات العامة', 'تنفيذ المباني السكنية والتجارية والفلل من الهيكل الخرساني حتى التسليم النهائي.' ),
	array( 'paint', 'التشطيبات والديكور', 'تشطيبات داخلية وخارجية فاخرة: لياسة، دهانات، أرضيات، جبس وواجهات حديثة.' ),
	array( 'tools', 'الترميم والصيانة', 'إعادة تأهيل المباني القديمة ومعالجة التشققات والعزل المائي والحراري.' ),
	array( 'bolt', 'الأعمال الكهروميكانيكية', 'تمديدات الكهرباء والسباكة والتكييف وأنظمة السلامة وفق الكود السعودي.' ),
	array( 'ruler', 'التصميم والإشراف الهندسي', 'تصاميم معمارية وإنشائية وإشراف هندسي متكامل يضمن جودة التنفيذ.' ),
	array( 'road', 'البنية التحتية', 'أعمال الحفر والردم والأسفلت وشبكات المياه والصرف والطرق الداخلية.' ),
);
?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"},"margin":{"top":"0"}}},"backgroundColor":"surface","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-surface-background-color has-background" style="margin-top:0;padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)"><!-- wp:group {"layout":{"type":"constrained","contentSize":"640px"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"align":"center","className":"rg-eyebrow"} -->
<p class="has-text-align-center rg-eyebrow">خدماتنا</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"textAlign":"center","fontSize":"xx-large"} -->
<h2 class="wp-block-heading has-text-align-center has-xx-large-font-size">حلول مقاولات متكاملة تحت سقف واحد</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","textColor":"muted"} -->
<p class="has-text-align-center has-muted-color has-text-color">نغطي جميع مراحل مشروعك بفريق متخصص وإدارة احترافية، لتستلم مشروعك جاهزاً بأعلى جودة.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<?php foreach ( array_chunk( $rg_services, 3 ) as $rg_row ) : ?>
<!-- wp:columns {"align":"wide","className":"rg-cards","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|40"},"margin":{"top":"var:preset|spacing|40"}}}} -->
<div class="wp-block-columns alignwide rg-cards" style="margin-top:var(--wp--preset--spacing--40)"><?php foreach ( $rg_row as $rg_s ) : ?><!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"rg-card","style":{"border":{"radius":"16px","width":"1px"},"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"shadow":"var:preset|shadow|card"},"backgroundColor":"base","borderColor":"line","layout":{"type":"default"}} -->
<div class="wp-block-group rg-card has-border-color has-line-border-color has-base-background-color has-background" style="border-width:1px;border-radius:16px;padding-top:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--50);padding-left:var(--wp--preset--spacing--40);box-shadow:var(--wp--preset--shadow--card)"><!-- wp:html -->
<div class="rg-icon"><?php echo roof_gulf_icon( $rg_s[0] ); // phpcs:ignore ?></div>
<!-- /wp:html -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><?php echo esc_html( $rg_s[1] ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"muted"} -->
<p class="has-muted-color has-text-color"><?php echo esc_html( $rg_s[2] ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column --><?php endforeach; ?></div>
<!-- /wp:columns -->
<?php endforeach; ?></div>
<!-- /wp:group -->
